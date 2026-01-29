'use strict';

/**
 * Central configuration loader.
 *
 * Note: This template’s .env exposes REACT_APP_* variables even for the backend container.
 * We therefore read from REACT_APP_* first and fall back to conventional names where helpful.
 */

// PUBLIC_INTERFACE
function getConfig() {
  /** Returns normalized runtime configuration derived from environment variables. */
  const nodeEnv = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development';

  // Express listen port: prefer container-provided REACT_APP_PORT
  const port = Number(process.env.REACT_APP_PORT || process.env.PORT || 3000);

  // Trust proxy: can be "true"/"false"/"1"/"0"/number
  const trustProxyRaw = process.env.REACT_APP_TRUST_PROXY;
  const trustProxy =
    trustProxyRaw === undefined
      ? true
      : trustProxyRaw === 'true' || trustProxyRaw === '1'
        ? true
        : trustProxyRaw === 'false' || trustProxyRaw === '0'
          ? false
          : Number.isNaN(Number(trustProxyRaw))
            ? true
            : Number(trustProxyRaw);

  const logLevel = process.env.REACT_APP_LOG_LEVEL || 'info';

  // Health endpoint path; defaults to '/'
  const healthcheckPath = process.env.REACT_APP_HEALTHCHECK_PATH || '/';

  // API versioned base path
  const apiBasePath = '/api/v1';

  // Auth configuration (scaffolding). Do NOT hardcode secrets; must be provided via env in real deployments.
  const jwtSecret =
    process.env.REACT_APP_JWT_SECRET ||
    process.env.JWT_SECRET ||
    null;

  const jwtIssuer = process.env.REACT_APP_JWT_ISSUER || 'backend_express';
  const jwtAudience = process.env.REACT_APP_JWT_AUDIENCE || 'multivendor-marketplace';

  // Database configuration (PostgreSQL container). These env vars are provided by the platform.
  // Do not hardcode credentials here.
  const postgresUrl = process.env.POSTGRES_URL || null;
  const postgresUser = process.env.POSTGRES_USER || null;
  const postgresPassword = process.env.POSTGRES_PASSWORD || null;
  const postgresDb = process.env.POSTGRES_DB || null;
  const postgresPort = process.env.POSTGRES_PORT || null;

  return {
    nodeEnv,
    port,
    trustProxy,
    logLevel,
    healthcheckPath,
    apiBasePath,
    auth: {
      jwtSecret,
      jwtIssuer,
      jwtAudience,
      jwtExpiresIn: process.env.REACT_APP_JWT_EXPIRES_IN || '1h',
    },
    db: {
      postgresUrl,
      postgresUser,
      postgresPassword,
      postgresDb,
      postgresPort,
    },
  };
}

module.exports = {
  getConfig,
};
