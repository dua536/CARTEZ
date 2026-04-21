const path = require('path');
const dotenv = require('dotenv');

const { checkDbConnection, closeDb } = require('../db');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkDb() {
  await checkDbConnection();
  console.log('Database connection successful');
}

checkDb()
  .catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
