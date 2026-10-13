
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: Protected route testing
 */

/**
 * @swagger
 * /api/test/profile:
 *   get:
 *     summary: Test protected route access
 *     description: Returns the authenticated user's information.
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Protected route accessed successfully
 *       401:
 *         description: Authentication required
 */
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route!",
    user: req.user
  });
});

module.exports = router;
