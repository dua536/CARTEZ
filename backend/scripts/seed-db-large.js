const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const oracledb = require('oracledb');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const MOCK_USER_COUNT = 60;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedLarge() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
    });

    console.log("Oracle connected ✅");

    // ---------------------------
    // INSERT USERS
    // ---------------------------
    for (let i = 1; i <= MOCK_USER_COUNT; i++) {
      const email = `mockuser${String(i).padStart(3, '0')}@test.com`;

      await connection.execute(
        `MERGE INTO users u
         USING (SELECT :email AS email FROM dual) src
         ON (u.email = src.email)
         WHEN MATCHED THEN
           UPDATE SET first_name = :fn, last_name = :ln, password = :pw
         WHEN NOT MATCHED THEN
           INSERT (first_name, last_name, email, password, role)
           VALUES (:fn, :ln, :email, :pw, 'customer')`,
        {
          email,
          fn: `Mock${i}`,
          ln: 'User',
          pw: 'password123',
        },
        { autoCommit: true }
      );
    }

    // ---------------------------
    // GET USERS
    // ---------------------------
    const usersResult = await connection.execute(
      `SELECT id FROM users WHERE email LIKE 'mockuser%'`
    );

    const userIds = usersResult.rows.map(u => u.ID);

    // ---------------------------
    // INSERT ORDERS (FIXED BINDS)
    // ---------------------------
    for (const userId of userIds) {
      const result = await connection.execute(
        `INSERT INTO orders
         (user_id, order_number, status, subtotal, shipping, taxes, total)
         VALUES (:userId, :orderNum, 'placed', 10, 2, 1, 13)
         RETURNING id INTO :id`,
        {
          userId: userId,
          orderNum: 'TEMP',
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      const orderId = result.outBinds.id[0];

      await connection.execute(
        `UPDATE orders SET order_number = :orderNum WHERE id = :id`,
        {
          orderNum: `ORD-${orderId}`,
          id: orderId
        },
        { autoCommit: true }
      );

      // ---------------------------
      // INSERT ORDER ITEMS
      // ---------------------------
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_name, quantity, unit_price, line_total)
         VALUES (:orderId, :productId, :name, :qty, :price, :total)`,
        {
          orderId: orderId,
          productId: 'prod-1',
          name: 'Sample Product',
          qty: 2,
          price: 10,
          total: 20
        },
        { autoCommit: true }
      );
    }

    console.log("Large seed completed (Oracle) ✅");

  } catch (err) {
    console.error("ERROR ❌:", err.message);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

seedLarge();