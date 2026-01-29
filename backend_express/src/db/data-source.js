'use strict';

require('reflect-metadata');

const { DataSource } = require('typeorm');
const { getConfig } = require('../config');

/**
 * Build TypeORM DataSource options from environment-driven config.
 * Prefers POSTGRES_URL when available; otherwise falls back to POSTGRES_* pieces.
 */
function buildDataSourceOptions() {
  const cfg = getConfig();

  const isProd = cfg.nodeEnv === 'production';

  // NOTE: synchronize is convenient for scaffolding but should be replaced with migrations in production.
  const synchronize = !isProd;

  // Prefer URL when provided by the platform (typical in container setups).
  if (cfg.db && cfg.db.postgresUrl) {
    return {
      type: 'postgres',
      url: cfg.db.postgresUrl,
      // Keep this minimal for now; entities/migrations will be added in later subtasks.
      entities: [],
      migrations: [],
      synchronize,
      logging: !isProd,
    };
  }

  // Fallback: use discrete env vars if URL is not provided.
  // In that case, we require all connection parts to avoid silent misconfiguration.
  const missing = [];
  if (!cfg.db?.postgresUser) missing.push('POSTGRES_USER');
  if (!cfg.db?.postgresPassword) missing.push('POSTGRES_PASSWORD');
  if (!cfg.db?.postgresDb) missing.push('POSTGRES_DB');
  if (!cfg.db?.postgresPort) missing.push('POSTGRES_PORT');

  if (missing.length > 0) {
    throw new Error(
      `PostgreSQL configuration missing. Provide POSTGRES_URL (preferred) or all of: ${missing.join(
        ', '
      )}`
    );
  }

  return {
    type: 'postgres',
    host: 'localhost',
    port: Number(cfg.db.postgresPort),
    username: cfg.db.postgresUser,
    password: cfg.db.postgresPassword,
    database: cfg.db.postgresDb,
    entities: [],
    migrations: [],
    synchronize,
    logging: !isProd,
  };
}

const AppDataSource = new DataSource(buildDataSourceOptions());

/**
 * PUBLIC_INTERFACE
 * Initialize and return the application's shared TypeORM DataSource.
 * Idempotent: if already initialized, it will not re-initialize.
 */
async function initDataSource() {
  /** Initializes the global TypeORM connection (returns the DataSource instance). */
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }
  await AppDataSource.initialize();
  return AppDataSource;
}

module.exports = {
  AppDataSource,
  initDataSource,
};
