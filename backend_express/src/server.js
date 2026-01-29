'use strict';

const app = require('./app');
const { getConfig } = require('./config');
const { initDataSource, AppDataSource } = require('./db/data-source');

const cfg = getConfig();

const PORT = cfg.port;
const HOST = process.env.HOST || '0.0.0.0';

let server;

/**
 * Bootstraps the server: connect DB first, then start listening.
 * If DB connection fails, we fail fast to avoid serving a broken API.
 */
async function start() {
  try {
    await initDataSource();
    // eslint-disable-next-line no-console
    console.log('Database connected (TypeORM).');

    server = app.listen(PORT, HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://${HOST}:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize database connection:', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received: closing HTTP server');

  if (server) {
    server.close(async () => {
      try {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          // eslint-disable-next-line no-console
          console.log('Database connection closed.');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error while closing database connection:', err);
      } finally {
        // eslint-disable-next-line no-console
        console.log('HTTP server closed');
        process.exit(0);
      }
    });
  } else {
    process.exit(0);
  }
});

module.exports = server;
