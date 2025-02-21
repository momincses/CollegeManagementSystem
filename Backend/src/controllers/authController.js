const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const sendOTP = require("../utils/nodemailer");

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: Request OTP
const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email }); // Create user entry if not found
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await user.save();

    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Step 2: Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true; // Mark user as verified
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Step 3: Register user
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Validate role
    const allowedRoles = ['student', 'student-coordinator'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Please complete OTP verification first" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    if (user.password) {
      return res.status(400).json({ message: "User already registered" });
    }

    // For coordinator role, add additional validation
    if (role === 'student-coordinator') {
      // You might want to add additional validation here
      // For example, check if the email domain matches a specific pattern
      // or if the user is in a specific year
      const emailDomain = email.split('@')[1];
      if (emailDomain !== 'sggs.ac.in') {
        return res.status(400).json({ 
          message: "Coordinator registration requires a valid college email" 
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.role = role; // Set the selected role
    await user.save();

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: "Registration successful", 
      token,
      role: user.role 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Step 4: Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Add logging to debug
    console.log('Login attempt:', { email, userFound: !!user });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {email: user.email, id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: "Logged in successfully", 
      token,
      role: user.role  // Add role to response
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { requestOtp, verifyOtp, register, login };
