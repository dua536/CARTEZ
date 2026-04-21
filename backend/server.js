const path = require('path');
const dotenv = require('dotenv');

const app = require('./app');
const { checkDbConnection, closeDb } = require('./db');

dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await checkDbConnection();

    const server = app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await closeDb();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

startServer();
