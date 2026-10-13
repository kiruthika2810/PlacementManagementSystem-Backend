
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Internship", "Part-time"],
      default: "Full-time"
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    minimumCgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    eligibleDegrees: {
      type: [String],
      default: []
    },
    eligibleGraduationYears: {
      type: [Number],
      default: []
    },
    applicationDeadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
