'use strict';

/**
 * Role authorization middleware.
 * Expects req.user to be set (e.g., via requireAuth).
 */
class RolesMiddleware {
  // PUBLIC_INTERFACE
  requireRoles(allowedRoles) {
    /** Returns express middleware enforcing that req.user.role is included in allowedRoles. */
    const allowSet = new Set(Array.isArray(allowedRoles) ? allowedRoles : []);
    return (req, res, next) => {
      const role = req.user && req.user.role;
      if (!role) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }
      if (!allowSet.has(role)) {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }
      return next();
    };
  }
}

module.exports = new RolesMiddleware();
