
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById
} = require("../controllers/jobController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listing and management
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: View all available jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 */
router.get("/", getJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: View a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *       404:
 *         description: Job not found
 */
router.get("/:id", getJobById);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a job
 *     description: Requires authentication and role authorization.
 *     tags: [Jobs]
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
 *               title: Backend Developer
 *               description: Develop and maintain backend APIs
 *               location: Chennai
 *               employmentType: Full-time
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.post("/", protect, createJob);

module.exports = router;
