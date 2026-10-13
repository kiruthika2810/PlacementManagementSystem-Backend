
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

async function resetRecruiterPassword() {
  try {
    const email = process.env.RECRUITER_RESET_EMAIL
      ?.trim()
      .toLowerCase();

    const password = process.env.RECRUITER_RESET_PASSWORD;

    if (!email || !password || password.length < 12) {
      throw new Error(
        "Set a recruiter email and a password of at least 12 characters in .env."
      );
    }

    await connectDB();

    const recruiter = await User.findOne({ email })
      .select("+passwordHash");

    if (!recruiter) {
      throw new Error("Recruiter account not found.");
    }

    if (recruiter.role !== "recruiter") {
      throw new Error(
        "This email does not belong to a recruiter account."
      );
    }

    recruiter.passwordHash = await bcrypt.hash(password, 12);
    await recruiter.save();

    console.log("Recruiter password reset successfully.");
    console.log("Recruiter email:", recruiter.email);
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

resetRecruiterPassword();
