
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  createCompany,
  getCompanies,
  getCompanyById,
  assignRecruiter
} = require("../controllers/companyController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company and recruiter management
 */

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: List all active companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 */
router.get("/", getCompanies);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *       404:
 *         description: Company not found
 */
router.get("/:id", getCompanyById);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create a company
 *     description: Requires login. The controller checks the admin role.
 *     tags: [Companies]
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
 *               name: Example Technologies
 *               industry: Information Technology
 *     responses:
 *       201:
 *         description: Company created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.post("/", protect, createCompany);

/**
 * @swagger
 * /api/companies/{id}/recruiter:
 *   patch:
 *     summary: Assign a recruiter to a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               recruiterId: REPLACE_WITH_RECRUITER_ID
 *     responses:
 *       200:
 *         description: Recruiter assignment processed
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Company or recruiter not found
 */
router.patch("/:id/recruiter", protect, assignRecruiter);

module.exports = router;
