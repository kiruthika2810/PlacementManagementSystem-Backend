
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    registrationNumber: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      unique: true
    },
    degree: {
      type: String,
      trim: true,
      default: "Integrated M.Tech"
    },
    department: {
      type: String,
      trim: true,
      required: true
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 2020,
      max: 2100
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },
    skills: {
      type: [String],
      default: []
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
