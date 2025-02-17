const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email app password (from Google App Passwords)
  },
});

// Function to send OTP
const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    });
    console.log("OTP sent successfully to", email);
  } catch (error) {
    console.log("Error sending OTP:", error);
    throw error;
  }
};

module.exports = sendOTP;
