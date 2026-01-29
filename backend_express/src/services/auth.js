'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../config');

/**
 * Authentication service scaffolding.
 * This intentionally does not integrate with a database yet; it provides primitives needed
 * by controllers/routes once user persistence is added.
 */
class AuthService {
  // PUBLIC_INTERFACE
  async hashPassword(plainPassword) {
    /** Hash a plaintext password using bcrypt. */
    if (!plainPassword || typeof plainPassword !== 'string') {
      throw new Error('Password is required');
    }
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
  }

  // PUBLIC_INTERFACE
  async verifyPassword(plainPassword, passwordHash) {
    /** Verify a plaintext password against a stored bcrypt hash. */
    if (!plainPassword || !passwordHash) {
      return false;
    }
    return bcrypt.compare(plainPassword, passwordHash);
  }

  // PUBLIC_INTERFACE
  signAccessToken(payload) {
    /** Create a signed JWT access token for the provided payload. */
    const cfg = getConfig();
    if (!cfg.auth.jwtSecret) {
      // Scaffold-friendly error message.
      throw new Error(
        'JWT secret is not configured. Set REACT_APP_JWT_SECRET (or JWT_SECRET) in the backend environment.'
      );
    }

    return jwt.sign(payload, cfg.auth.jwtSecret, {
      expiresIn: cfg.auth.jwtExpiresIn,
      issuer: cfg.auth.jwtIssuer,
      audience: cfg.auth.jwtAudience,
    });
  }

  // PUBLIC_INTERFACE
  verifyAccessToken(token) {
    /** Verify a JWT access token and return its decoded payload. */
    const cfg = getConfig();
    if (!cfg.auth.jwtSecret) {
      throw new Error(
        'JWT secret is not configured. Set REACT_APP_JWT_SECRET (or JWT_SECRET) in the backend environment.'
      );
    }
    return jwt.verify(token, cfg.auth.jwtSecret, {
      issuer: cfg.auth.jwtIssuer,
      audience: cfg.auth.jwtAudience,
    });
  }
}

module.exports = new AuthService();
