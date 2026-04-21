const path = require('path');
const dotenv = require('dotenv');
const oracledb = require('oracledb');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

// ✅ UNIVERSAL QUERY FUNCTION
async function query(sql, params = {}, isReturning = false) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
    };

    let bindParams = params;

    // 🔥 If RETURNING is used → inject OUT bind automatically
    if (isReturning) {
      bindParams = {
        ...params,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      };
    }

    const result = await connection.execute(sql, bindParams, options);

    // ✅ RETURNING case
    if (isReturning) {
      return result;
    }

    // ✅ SELECT case
    if (result.rows) {
      return result.rows;
    }

    // ✅ UPDATE / DELETE case
    return result;

  } catch (err) {
    console.error("DB Query Error:", err.message);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// ✅ CHECK DB
async function checkDbConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Oracle DB connected ✅");
  } catch (err) {
    console.error("Oracle connection failed ❌:", err.message);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// ✅ DIRECT CONNECTION (used in orders)
async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

// ✅ CLOSE (no-op)
async function closeDb() {
  console.log("Oracle DB closed");
}

module.exports = {
  query,
  checkDbConnection,
  getConnection,
  closeDb,
};