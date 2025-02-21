const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false }, // Stores OTP verification status
  role: { 
    type: String,
    enum: ["admin", "student", "doctor", "student-coordinator"], 
    default: "student" 
  }, // Default role
},
  {
    timestamps: true,
  });

module.exports = mongoose.model("User", userSchema);
