'use strict';

const authService = require('../services/auth');

/**
 * Auth middleware: validates Authorization: Bearer <token> and attaches req.user.
 *
 * This is scaffolding: when DB integration arrives, the JWT payload can be enriched
 * with userId/role and cross-checked against persistence if desired.
 */
class AuthMiddleware {
  // PUBLIC_INTERFACE
  requireAuth(req, res, next) {
    /** Enforces that a valid Bearer token is present; attaches req.user. */
    try {
      const header = req.headers.authorization || req.headers.Authorization;
      if (!header || typeof header !== 'string') {
        return res.status(401).json({ status: 'error', message: 'Missing Authorization header' });
      }

      const [scheme, token] = header.split(' ');
      if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ status: 'error', message: 'Invalid Authorization header format' });
      }

      const decoded = authService.verifyAccessToken(token);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
  }
}

module.exports = new AuthMiddleware();
