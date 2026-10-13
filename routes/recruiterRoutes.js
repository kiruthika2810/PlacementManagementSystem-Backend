
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createRecruiter,
  getRecruiters
} = require("../controllers/recruiterController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recruiters
 *   description: Recruiter management
 */

/**
 * @swagger
 * /api/recruiters:
 *   get:
 *     summary: Get recruiters
 *     description: Retrieves recruiters using the existing controller logic.
 *     tags: [Recruiters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recruiters retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/", protect, getRecruiters);

/**
 * @swagger
 * /api/recruiters:
 *   post:
 *     summary: Create a recruiter
 *     tags: [Recruiters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               name: Recruiter One
 *               email: recruiter@example.com
 *               companyId: REPLACE_WITH_COMPANY_ID
 *     responses:
 *       201:
 *         description: Recruiter created successfully
 *       400:
 *         description: Invalid recruiter data
 *       401:
 *         description: Authentication required
 */
router.post("/", protect, createRecruiter);

module.exports = router;
