const jwt = require("jsonwebtoken");
const StudentCoordinator = require("../models/StudentCoordinator");
const ClassCoordinator = require("../models/ClassCoordinator");


const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role }, // ✅ Matching frontend expectations
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Signup via Invitation Link
exports.signupWithInvitation = async (req, res) => {
    const { token } = req.params;
    const { name, password, branch, year, club } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.INVITATION_SECRET);
      const { email, role } = decoded;
  
      if (role === "class-coordinator") {
        if (!branch || !year) return res.status(400).json({ message: "Branch and year required" });
  
        const exists = await ClassCoordinator.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already registered" });
  
        const newUser = await ClassCoordinator.create({ name, email, password, branch, year });
        res.status(201).json({ message: "Class Coordinator registered successfully" });
  
      } else if (role === "student-coordinator") {
        if (!club) return res.status(400).json({ message: "Club/committee name required" });
  
        const exists = await StudentCoordinator.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already registered" });
  
        const newUser = await StudentCoordinator.create({ name, email, password, club });
        res.status(201).json({ message: "Student Coordinator registered successfully" });
  
      } else {
        return res.status(400).json({ message: "Invalid role in token" });
      }
  
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Invalid or expired invitation link" });
    }
  };

// Student Coordinator Login
exports.loginStudentCoordinator = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await StudentCoordinator.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, email, "student-coordinator");
    console.log(user._id)
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};


// Class Coordinator Login
exports.loginClassCoordinator = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await ClassCoordinator.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, email, "class-coordinator");
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
