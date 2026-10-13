
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");

async function getDashboardStats(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can view dashboard analytics."
      });
    }

    const now = new Date();

    const [
      totalStudents,
      totalCompanies,
      openJobs,
      totalApplications,
      shortlistedApplications,
      selectedApplications,
      rejectedApplications
    ] = await Promise.all([
      User.countDocuments({
        role: "student",
        isActive: true
      }),
      Company.countDocuments({
        isActive: true
      }),
      Job.countDocuments({
        status: "Open",
        applicationDeadline: { $gt: now }
      }),
      Application.countDocuments(),
      Application.countDocuments({
        status: "Shortlisted"
      }),
      Application.countDocuments({
        status: "Selected"
      }),
      Application.countDocuments({
        status: "Rejected"
      })
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully.",
      statistics: {
        totalStudents,
        totalCompanies,
        openJobs,
        totalApplications,
        shortlistedApplications,
        selectedApplications,
        rejectedApplications
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard statistics."
    });
  }
}

module.exports = { getDashboardStats };
