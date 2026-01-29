'use strict';

const express = require('express');
const healthController = require('../controllers/health');
const { getConfig } = require('../config');
const apiV1Router = require('./api.v1');

const router = express.Router();
const cfg = getConfig();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     description: Basic service health check (may be remapped via REACT_APP_HEALTHCHECK_PATH at runtime).
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get(cfg.healthcheckPath, healthController.check.bind(healthController));

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: API root
 *     description: Lists basic API info for v1.
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/api/v1', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    version: 'v1',
    message: 'API is running',
  });
});

router.use('/api/v1', apiV1Router);

module.exports = router;
