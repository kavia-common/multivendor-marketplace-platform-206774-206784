'use strict';

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { getConfig } = require('../config');

// PUBLIC_INTERFACE
function buildSecurityMiddleware() {
  /** Returns an array of standard security middleware for the Express app. */
  const cfg = getConfig();

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Avoid noisy logs in tests
  const morganFormat = cfg.nodeEnv === 'production' ? 'combined' : 'dev';

  return [
    helmet(),
    limiter,
    morgan(morganFormat),
  ];
}

module.exports = {
  buildSecurityMiddleware,
};
