'use strict';

const express = require('express');
const authController = require('../controllers/auth');
const { auth, roles } = require('../middleware');
const { ROLES } = require('../utils/roles');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and authorization
 *   - name: Example
 *     description: Example protected routes
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a user (scaffolding)
 *     description: Registers a user using an in-memory store. Replace with DB integration later.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "P@ssw0rd!"
 *               role:
 *                 type: string
 *                 enum: [admin, vendor, customer]
 *                 example: customer
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post('/auth/register', authController.register.bind(authController));

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login (scaffolding)
 *     description: Logs in a user using the in-memory store and returns a JWT access token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/login', authController.login.bind(authController));

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Current user
 *     description: Returns the authenticated user's JWT payload.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing/invalid token
 */
router.get('/auth/me', auth.requireAuth.bind(auth), authController.me.bind(authController));

/**
 * @swagger
 * /api/v1/example/admin-only:
 *   get:
 *     summary: Example admin-only endpoint
 *     tags: [Example]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing/invalid token
 *       403:
 *         description: Forbidden
 */
router.get(
  '/example/admin-only',
  auth.requireAuth.bind(auth),
  roles.requireRoles([ROLES.ADMIN]),
  (req, res) => res.status(200).json({ status: 'ok', message: 'Hello admin!', user: req.user })
);

module.exports = router;
