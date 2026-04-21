const { query } = require('../../db');

function formatCartItem(item) {
  return {
    ...item,
    price: item.PRICE !== null ? Number(item.PRICE) : null,
    quantity: item.QUANTITY !== null ? Number(item.QUANTITY) : 0,
    unitWeight: item.UNITWEIGHT !== null ? Number(item.UNITWEIGHT) : null,
  };
}

// ✅ GET CART
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const result = await query(
      `SELECT ci.product_id AS id, p.name, p.price, p.image,
              p.sale_type AS saleType, p.unit, p.unit_weight AS unitWeight,
              p.description, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = :userId
       ORDER BY ci.created_at DESC`,
      { userId }
    );

    res.json({ items: result.map(formatCartItem) });
  } catch (error) {
    next(error);
  }
};

// ✅ ADD TO CART
exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { id, quantity } = req.body;
    const parsedQuantity = Number(quantity);

    if (!id || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required' });
    }

    const productCheck = await query(
      `SELECT id FROM products WHERE id = :id`,
      { id }
    );

    if (productCheck.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await query(
      `MERGE INTO cart_items c
       USING (SELECT :userId user_id, :productId product_id FROM dual) src
       ON (c.user_id = src.user_id AND c.product_id = src.product_id)
       WHEN MATCHED THEN
         UPDATE SET quantity = :qty
       WHEN NOT MATCHED THEN
         INSERT (user_id, product_id, quantity)
         VALUES (:userId, :productId, :qty)`,
      {
        userId,
        productId: id,
        qty: parsedQuantity
      }
    );

    const updated = await query(
      `SELECT ci.product_id AS id, p.name, p.price, p.image,
              p.sale_type AS saleType, p.unit, p.unit_weight AS unitWeight,
              p.description, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = :userId AND ci.product_id = :productId`,
      { userId, productId: id }
    );

    res.status(201).json(formatCartItem(updated[0]));
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE CART ITEM
exports.updateCartItem = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const productId = req.params.id;
    const parsedQuantity = Number(req.body.quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ message: 'Valid quantity required' });
    }

    const existing = await query(
      `SELECT id FROM cart_items WHERE product_id = :productId AND user_id = :userId`,
      { productId, userId }
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (parsedQuantity === 0) {
      await query(
        `DELETE FROM cart_items WHERE product_id = :productId AND user_id = :userId`,
        { productId, userId }
      );
      return res.json({ message: 'Item removed from cart' });
    }

    await query(
      `UPDATE cart_items SET quantity = :qty WHERE product_id = :productId AND user_id = :userId`,
      { qty: parsedQuantity, productId, userId }
    );

    const updated = await query(
      `SELECT ci.product_id AS id, p.name, p.price, p.image,
              p.sale_type AS saleType, p.unit, p.unit_weight AS unitWeight,
              p.description, ci.quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = :userId AND ci.product_id = :productId`,
      { userId, productId }
    );

    res.json(formatCartItem(updated[0]));
  } catch (error) {
    next(error);
  }
};

// ✅ REMOVE ITEM
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const productId = req.params.id;

    await query(
      `DELETE FROM cart_items WHERE product_id = :productId AND user_id = :userId`,
      { productId, userId }
    );

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

// ✅ CLEAR CART
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    await query(
      `DELETE FROM cart_items WHERE user_id = :userId`,
      { userId }
    );

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};