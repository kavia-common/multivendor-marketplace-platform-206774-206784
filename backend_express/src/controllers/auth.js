'use strict';

const authService = require('../services/auth');
const { ROLES, isValidRole } = require('../utils/roles');

// Simple in-memory store to support scaffolding flows without DB.
// Keyed by email.
const users = new Map();

/**
 * WARNING: In-memory store is only for scaffolding.
 * Replace with DB persistence (PostgreSQL via ORM) in next step.
 */
class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res) {
    /** Register a user with email/password and role (customer/vendor/admin). */
    try {
      const { email, password, role } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'email and password are required' });
      }
      const normalizedEmail = String(email).toLowerCase().trim();
      const finalRole = role ? String(role).toLowerCase().trim() : ROLES.CUSTOMER;

      if (!isValidRole(finalRole)) {
        return res.status(400).json({ status: 'error', message: `Invalid role. Allowed: ${Object.values(ROLES).join(', ')}` });
      }

      if (users.has(normalizedEmail)) {
        return res.status(409).json({ status: 'error', message: 'User already exists' });
      }

      const passwordHash = await authService.hashPassword(password);
      const user = {
        id: `tmp_${Date.now()}`,
        email: normalizedEmail,
        role: finalRole,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      users.set(normalizedEmail, user);

      const token = authService.signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(201).json({
        status: 'ok',
        user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt },
        accessToken: token,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to register user' });
    }
  }

  // PUBLIC_INTERFACE
  async login(req, res) {
    /** Login a user by email/password and return an access token. */
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'email and password are required' });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const user = users.get(normalizedEmail);

      // Do not leak existence
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      const ok = await authService.verifyPassword(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }

      const token = authService.signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(200).json({
        status: 'ok',
        user: { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt },
        accessToken: token,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to login' });
    }
  }

  // PUBLIC_INTERFACE
  async me(req, res) {
    /** Return the current authenticated user's JWT payload. */
    return res.status(200).json({
      status: 'ok',
      user: req.user,
    });
  }
}

module.exports = new AuthController();
