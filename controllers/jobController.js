
const mongoose = require("mongoose");
const Job = require("../models/Job");
const Company = require("../models/Company");

// Create a job posting
async function createJob(req, res) {
  try {
    if (!["admin", "recruiter"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only administrators or authorized recruiters can post jobs."
      });
    }

    const {
      title,
      description,
      company,
      location,
      employmentType,
      requiredSkills,
      minimumCgpa,
      eligibleDegrees,
      eligibleGraduationYears,
      applicationDeadline
    } = req.body;

    if (
      !title ||
      !description ||
      !company ||
      !location ||
      !applicationDeadline
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description, company, location and deadline are required."
      });
    }

    if (!mongoose.isValidObjectId(company)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID."
      });
    }

    const deadline = new Date(applicationDeadline);

    if (
      Number.isNaN(deadline.getTime()) ||
      deadline <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Application deadline must be a valid future date."
      });
    }

    const companyRecord = await Company.findOne({
      _id: company,
      isActive: true
    });

    if (!companyRecord) {
      return res.status(404).json({
        success: false,
        message: "Active company not found."
      });
    }

    if (
      req.user.role === "recruiter" &&
      String(companyRecord.recruiter) !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to post jobs for this company."
      });
    }

    const job = await Job.create({
      title,
      description,
      company,
      postedBy: req.user.userId,
      location,
      employmentType,
      requiredSkills,
      minimumCgpa,
      eligibleDegrees,
      eligibleGraduationYears,
      applicationDeadline: deadline
    });

    return res.status(201).json({
      success: true,
      message: "Job posted successfully.",
      job
    });
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job data. Please check your inputs."
      });
    }

    console.error("Create job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create job posting."
    });
  }
}

// List open jobs that have not passed their deadlines
async function getJobs(req, res) {
  try {
    const jobs = await Job.find({
      status: "Open",
      applicationDeadline: { $gt: new Date() }
    })
      .populate("company", "name industry location website")
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve job postings."
    });
  }
}

// Get a single open job by ID
async function getJobById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID."
      });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      status: "Open",
      applicationDeadline: { $gt: new Date() }
    })
      .populate("company", "name industry location website")
      .select("-__v");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Open job not found."
      });
    }

    return res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error("Get job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve job details."
    });
  }
}

module.exports = {
  createJob,
  getJobs,
  getJobById
};
