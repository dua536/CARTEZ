
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const oracledb = require('oracledb');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seedDb() {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbConnectionString = process.env.DB_CONNECTION_STRING;

  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: dbUser,
      password: dbPassword,
      connectionString: dbConnectionString,
    });

    // Oracle does NOT support multiple statements like MySQL
    // So we split SQL file by semicolon (;)
    const statements = seedSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const stmt of statements) {
      try {
        await connection.execute(stmt);
      } catch (err) {
        console.error('Error executing statement:', stmt);
        console.error(err.message);
      }
    }

    await connection.commit();

    console.log('Database seeded successfully (Oracle)');
  } catch (error) {
    console.error('Database seed failed:', error.message);
    console.error('Check Oracle DB connection and .env credentials.');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
}

seedDb();