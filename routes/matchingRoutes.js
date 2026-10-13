
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getJobMatches
} = require("../controllers/matchingController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Matching
 *   description: Job matching and recommendations
 */

/**
 * @swagger
 * /api/matching:
 *   get:
 *     summary: Get job matches for the logged-in user
 *     description: Returns job matches using the existing matching logic.
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job matches retrieved successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.get("/", protect, getJobMatches);

module.exports = router;
