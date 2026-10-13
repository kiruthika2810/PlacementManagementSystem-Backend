
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

async function createAdmin() {
  try {
    const name = process.env.ADMIN_SETUP_NAME;
    const email = process.env.ADMIN_SETUP_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_SETUP_PASSWORD;

    if (!name || !email || !password || password.length < 12) {
      throw new Error(
        "Provide admin name, email and a password of at least 12 characters in .env."
      );
    }

    await connectDB();

    const passwordHash = await bcrypt.hash(password, 12);

    let user = await User.findOne({ email }).select("+passwordHash");

    if (user && user.role !== "admin") {
      throw new Error(
        "This email already belongs to a non-admin account. Use a separate admin email."
      );
    }

    
if (user) {
  user.name = name;
  user.passwordHash = passwordHash;
  user.isActive = true;

  await user.save();

  console.log("Existing administrator account updated successfully.");
} else {
  user = await User.create({
    name,
    email,
    passwordHash,
    role: "admin",
    isActive: true
  });

  console.log("Administrator account created successfully.");
}


    console.log("Admin email:", user.email);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
