
const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  applyForJob,
  getMyApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job applications and application status management
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
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
 *               jobId: REPLACE_WITH_JOB_ID
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Invalid application data
 *       401:
 *         description: Authentication required
 */
router.post("/", protect, applyForJob);

/**
 * @swagger
 * /api/applications/my:
 *   get:
 *     summary: View the logged-in student's applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/my", protect, getMyApplications);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update an application's status
 *     description: Access permissions are enforced by the existing middleware/controller.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               status: Shortlisted
 *     responses:
 *       200:
 *         description: Application status updated
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Application not found
 */
router.patch("/:id/status", protect, updateApplicationStatus);

module.exports = router;
