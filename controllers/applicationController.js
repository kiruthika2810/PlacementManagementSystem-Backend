
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Job = require("../models/Job");

// Apply for a job
async function applyForJob(req, res) {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can apply for jobs."
      });
    }

    const { jobId, coverLetter = "" } = req.body;

    if (!jobId || !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid job ID."
      });
    }

    if (
      typeof coverLetter !== "string" ||
      coverLetter.length > 3000
    ) {
      return res.status(400).json({
        success: false,
        message: "Cover letter must be 3000 characters or fewer."
      });
    }

    const student = await Student.findOne({
      user: req.user.userId
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Create your student profile before applying."
      });
    }

    const job = await Job.findOne({
      _id: jobId,
      status: "Open",
      applicationDeadline: { $gt: new Date() }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found, closed, or past its deadline."
      });
    }

    // Check basic academic eligibility.
    if (
      student.cgpa < job.minimumCgpa ||
      (
        job.eligibleDegrees.length > 0 &&
        !job.eligibleDegrees.includes(student.degree)
      ) ||
      (
        job.eligibleGraduationYears.length > 0 &&
        !job.eligibleGraduationYears.includes(
          student.graduationYear
        )
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not meet this job's academic eligibility criteria."
      });
    }

    const application = await Application.create({
      student: student._id,
      job: job._id,
      coverLetter: coverLetter.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully.",
      application
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job."
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application data."
      });
    }

    console.error("Apply for job error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your application."
    });
  }
}

// View the logged-in student's applications
async function getMyApplications(req, res) {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their applications."
      });
    }

    const student = await Student.findOne({
      user: req.user.userId
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found."
      });
    }

    const applications = await Application.find({
      student: student._id
    })
      .populate({
        path: "job",
        select: "title location employmentType applicationDeadline status company",
        populate: {
          path: "company",
          select: "name location"
        }
      })
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("Get applications error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve applications."
    });
  }
}


async function updateApplicationStatus(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can update application status."
      });
    }

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Rejected",
      "Selected"
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status."
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID."
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found."
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application
    });
  } catch (error) {
    console.error("Update application status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update application status."
    });
  }
}

module.exports = {
  applyForJob,
  getMyApplications,
  updateApplicationStatus
};
