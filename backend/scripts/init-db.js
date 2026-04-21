const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const oracledb = require('oracledb');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function initDb() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
  };

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Split safely using regex (better for Oracle)
    const statements = schemaSql
      .split(/;\s*$/gm)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const stmt of statements) {
      try {
        await connection.execute(stmt);
      } catch (err) {
        console.error("Error executing statement:");
        console.error(stmt);
        console.error(err.message);
      }
    }

    await connection.commit(); // ✅ ensure changes saved

    console.log('Oracle database initialized successfully ✅');
  } catch (error) {
    console.error('Database init failed ❌:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

initDb();