
const mongoose = require("mongoose");
const Company = require("../models/Company");
const User = require("../models/User");
// Create a company (admin only)
async function createCompany(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can create companies."
      });
    }

    const {
      name,
      industry,
      description,
      website,
      location,
      contactEmail
    } = req.body;

    if (!name || !industry || !location || !contactEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Company name, industry, location and contact email are required."
      });
    }

    const company = await Company.create({
      name,
      industry,
      description,
      website,
      location,
      contactEmail
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully.",
      company
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A company with this name already exists."
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company data. Please check your inputs."
      });
    }

    console.error("Create company error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create company."
    });
  }
}

// Get all active companies
async function getCompanies(req, res) {
  try {
    const companies = await Company.find({ isActive: true })
      .select("-__v")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    console.error("Get companies error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve companies."
    });
  }
}

// Get one active company by ID
async function getCompanyById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID."
      });
    }

    const company = await Company.findOne({
      _id: req.params.id,
      isActive: true
    }).select("-__v");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found."
      });
    }

    return res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    console.error("Get company error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve company."
    });
  }
}

async function assignRecruiter(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can assign recruiters."
      });
    }

    const { id } = req.params;
    const { recruiterId } = req.body;

    if (
      !mongoose.isValidObjectId(id) ||
      !mongoose.isValidObjectId(recruiterId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid company ID and recruiter ID are required."
      });
    }

    const company = await Company.findOne({
      _id: id,
      isActive: true
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Active company not found."
      });
    }

    const recruiter = await User.findOne({
      _id: recruiterId,
      role: "recruiter",
      isActive: true
    });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Active recruiter account not found."
      });
    }

    company.recruiter = recruiter._id;
    await company.save();

    return res.status(200).json({
      success: true,
      message: "Recruiter assigned successfully.",
      company: {
        id: company._id,
        name: company.name,
        recruiter: {
          id: recruiter._id,
          name: recruiter.name,
          email: recruiter.email
        }
      }
    });
  } catch (error) {
    console.error("Assign recruiter error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to assign recruiter."
    });
  }
}


module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  assignRecruiter
};
