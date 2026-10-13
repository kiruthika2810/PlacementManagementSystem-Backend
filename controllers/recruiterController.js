
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createRecruiter(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can create recruiter accounts."
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must contain between 2 and 100 characters."
      });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    if (typeof password !== "string" || password.length < 12) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 12 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const recruiter = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "recruiter"
    });

    return res.status(201).json({
      success: true,
      message: "Recruiter account created successfully.",
      recruiter: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        role: recruiter.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    console.error("Create recruiter error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create recruiter account."
    });
  }
}

async function getRecruiters(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can view recruiters."
      });
    }

    const recruiters = await User.find({
      role: "recruiter",
      isActive: true
    })
      .select("name email role createdAt")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: recruiters.length,
      recruiters
    });
  } catch (error) {
    console.error("Get recruiters error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve recruiters."
    });
  }
}


module.exports = {
  createRecruiter,
  getRecruiters
};
