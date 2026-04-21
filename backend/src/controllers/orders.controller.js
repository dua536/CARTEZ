const { getConnection } = require('../../db');
const oracledb = require('oracledb');

const UNIT_SCALE = 1000;
const TAX_RATE = 0.05;
const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 5.99;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStatus(status) {
  const supported = new Set(['placed', 'in-transit', 'delivered', 'cancelled']);
  return supported.has(status) ? status : 'placed';
}

function buildOrderNumber(orderId) {
  const base = String(orderId).padStart(4, '0');
  return `CZ-${base}`;
}

function getItemMultiplier(saleType, quantity) {
  return saleType === 'variable' ? quantity / UNIT_SCALE : quantity;
}

// ✅ LIST ORDERS
exports.listOrders = async (req, res, next) => {
  const connection = await getConnection();

  try {
    const userId = req.auth.userId;

    const ordersResult = await connection.execute(
      `SELECT id, order_number, status, subtotal, shipping, taxes, total,
              payment_method, delivery_notes, address_snapshot, created_at
       FROM orders
       WHERE user_id = :userId
       ORDER BY created_at DESC`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // ✅ FIX
    );

    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.json({ orders: [] });
    }

    const orderIds = orders.map(o => o.ID);

    if (orderIds.length === 0) {
      return res.json({ orders: [] });
    }

    const itemsResult = await connection.execute(
      `SELECT id, order_id, product_id, product_name, quantity, unit_price, line_total
       FROM order_items
       WHERE order_id IN (${orderIds.map((_, i) => `:id${i}`).join(',')})
       ORDER BY id ASC`,
      Object.fromEntries(orderIds.map((id, i) => [`id${i}`, id])),
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // ✅ FIX
    );

    const items = itemsResult.rows;

    const itemsByOrderId = new Map();

    items.forEach(item => {
      const list = itemsByOrderId.get(item.ORDER_ID) || [];
      list.push({
        id: item.ID,
        productId: item.PRODUCT_ID,
        productName: item.PRODUCT_NAME,
        quantity: toNumber(item.QUANTITY),
        unitPrice: toNumber(item.UNIT_PRICE),
        lineTotal: toNumber(item.LINE_TOTAL),
      });
      itemsByOrderId.set(item.ORDER_ID, list);
    });

    const payload = orders.map(order => {
      const orderItems = itemsByOrderId.get(order.ID) || [];

      let parsedAddress = null;
      try {
        parsedAddress = order.ADDRESS_SNAPSHOT
          ? JSON.parse(order.ADDRESS_SNAPSHOT)
          : null;
      } catch {
        parsedAddress = null;
      }

      return {
        id: order.ID,
        orderNumber: order.ORDER_NUMBER,
        status: normalizeStatus(order.STATUS),
        subtotal: toNumber(order.SUBTOTAL),
        shipping: toNumber(order.SHIPPING),
        taxes: toNumber(order.TAXES),
        total: toNumber(order.TOTAL),
        paymentMethod: order.PAYMENT_METHOD,
        deliveryNotes: order.DELIVERY_NOTES,
        addressSnapshot: parsedAddress,
        createdAt: order.CREATED_AT,
        itemCount: orderItems.reduce((sum, i) => sum + i.quantity, 0),
        items: orderItems,
      };
    });

    res.json({ orders: payload });

  } catch (error) {
    console.error('LIST ORDERS ERROR:', error);
    next(error);
  } finally {
    await connection.close();
  }
};

// ✅ PLACE ORDER
exports.placeOrder = async (req, res, next) => {
  const connection = await getConnection();

  try {
    const userId = req.auth.userId;

    const {
      addressId,
      paymentMethod,
      deliveryNotes,
      address_id,
      payment_method,
      notes
    } = req.body;

    const finalAddressId = addressId || address_id;
    const finalPaymentMethod = paymentMethod || payment_method;
    const finalDeliveryNotes = deliveryNotes || notes || null;

    console.log('FINAL ORDER DATA:', {
      finalAddressId,
      finalPaymentMethod,
      finalDeliveryNotes
    });

    if (!finalAddressId) {
      return res.status(400).json({ message: 'Address required' });
    }

    const addressResult = await connection.execute(
      `SELECT * FROM addresses 
       WHERE id = :id AND user_id = :userId 
       FETCH FIRST 1 ROWS ONLY`,
      { id: finalAddressId, userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (addressResult.rows.length === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const cartResult = await connection.execute(
      `SELECT ci.product_id, ci.quantity,
              p.name, p.price, p.sale_type
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = :userId`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const saleType = item.SALE_TYPE || 'fixed';
      const quantity = Number(item.QUANTITY) || 0;
      const price = Number(item.PRICE) || 0;

      return sum + getItemMultiplier(saleType, quantity) * price;
    }, 0);

    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + shipping + taxes;

    const snapshot = JSON.stringify({
      id: addressResult.rows[0].ID,
      city: addressResult.rows[0].CITY,
      province: addressResult.rows[0].PROVINCE
    });

    const result = await connection.execute(
      `INSERT INTO orders
       (user_id, order_number, status, subtotal, shipping, taxes, total, payment_method, delivery_notes, address_snapshot)
       VALUES (:userId, 'TEMP', 'placed', :subtotal, :shipping, :taxes, :total, :payment, :notes, :snapshot)
       RETURNING id INTO :id`,
      {
        userId,
        subtotal,
        shipping,
        taxes,
        total,
        payment: finalPaymentMethod,
        notes: finalDeliveryNotes,
        snapshot,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    const orderId = result.outBinds.id[0];

    await connection.execute(
      `UPDATE orders SET order_number = :num WHERE id = :id`,
      { num: buildOrderNumber(orderId), id: orderId }
    );

    for (const item of cartItems) {
      if (!item.PRODUCT_ID) continue;

      const quantity = Number(item.QUANTITY) || 0;
      const price = Number(item.PRICE) || 0;

      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_name, quantity, unit_price, line_total)
         VALUES (:orderId, :pid, :name, :qty, :price, :total)`,
        {
          orderId,
          pid: item.PRODUCT_ID,
          name: item.NAME,
          qty: quantity,
          price: price,
          total: quantity * price
        }
      );
    }

    await connection.execute(
      `DELETE FROM cart_items WHERE user_id = :userId`,
      { userId }
    );

    await connection.commit();

    res.status(201).json({ id: orderId });

  } catch (error) {
    await connection.rollback();
    console.error('ORDER ERROR FULL:', error);
    next(error);
  } finally {
    await connection.close();
  }
};