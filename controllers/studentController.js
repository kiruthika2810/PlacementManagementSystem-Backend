
const Student = require("../models/Student");

async function createProfile(req, res) {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can create student profiles."
      });
    }

    const {
      registrationNumber,
      degree,
      department,
      graduationYear,
      cgpa,
      skills,
      resumeUrl
    } = req.body;

    if (!department || graduationYear == null || cgpa == null) {
      return res.status(400).json({
        success: false,
        message: "Department, graduation year and CGPA are required."
      });
    }

    const existingProfile = await Student.findOne({
      user: req.user.userId
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "A student profile already exists for this account."
      });
    }

    const profile = await Student.create({
      user: req.user.userId,
      registrationNumber,
      degree,
      department,
      graduationYear,
      cgpa,
      skills,
      resumeUrl
    });

    return res.status(201).json({
      success: true,
      message: "Student profile created successfully.",
      profile
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This registration number or profile is already in use."
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data. Check the values you entered."
      });
    }

    console.error("Create profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create student profile."
    });
  }
}

async function getMyProfile(req, res) {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access this profile."
      });
    }

    const profile = await Student.findOne({
      user: req.user.userId
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found."
      });
    }

    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve student profile."
    });
  }
}

async function updateProfile(req, res) {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can update student profiles."
      });
    }

    const allowedFields = [
      "registrationNumber",
      "degree",
      "department",
      "graduationYear",
      "cgpa",
      "skills",
      "resumeUrl"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one profile field to update."
      });
    }

    const profile = await Student.findOne({
      user: req.user.userId
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found."
      });
    }

    for (const [field, value] of Object.entries(updates)) {
      profile[field] = value;
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully.",
      profile
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That registration number is already in use."
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile data. Check the values you entered."
      });
    }

    console.error("Update profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update student profile."
    });
  }
}

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile
};