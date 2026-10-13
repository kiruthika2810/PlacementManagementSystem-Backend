
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: API health checks
 */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check whether the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Placement Management System API is running!
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Placement Management System API is running!"
  });
});

module.exports = router;
