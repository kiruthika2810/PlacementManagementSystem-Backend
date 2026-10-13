
const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  createProfile,
  getMyProfile,
  updateProfile
} = require("../controllers/studentController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student profile management
 */

/**
 * @swagger
 * /api/students/profile:
 *   post:
 *     summary: Create a student profile
 *     tags: [Students]
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
 *               name: Student One
 *               department: Software Engineering
 *               skills:
 *                 - Java
 *                 - Node.js
 *     responses:
 *       201:
 *         description: Student profile created
 *       401:
 *         description: Authentication required
 *       400:
 *         description: Invalid profile data
 */
router.post("/profile", protect, createProfile);

/**
 * @swagger
 * /api/students/profile:
 *   get:
 *     summary: Get the logged-in student's profile
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Student profile not found
 */
router.get("/profile", protect, getMyProfile);

/**
 * @swagger
 * /api/students/profile:
 *   patch:
 *     summary: Update the logged-in student's profile
 *     tags: [Students]
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
 *               skills:
 *                 - Java
 *                 - MongoDB
 *     responses:
 *       200:
 *         description: Student profile updated
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Student profile not found
 */
router.patch("/profile", protect, updateProfile);

module.exports = router;
