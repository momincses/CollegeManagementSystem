const Misconduct = require("../models/MisconductModel");
const User = require("../models/usermodel");

// Report new misconduct
exports.reportMisconduct = async (req, res) => {
  try {
    const { studentId, studentName, examDate, examType, reason, additionalNotes } = req.body;
    
    // Verify student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const misconduct = await Misconduct.create({
      studentId,
      studentName,
      examDate,
      examType,
      reason,
      additionalNotes,
      reportedBy: req.user.id // Faculty ID from auth middleware
    });

    res.status(201).json({ 
      success: true, 
      message: "Misconduct report created successfully",
      misconduct 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error creating misconduct report", 
      error: error.message 
    });
  }
};

// Get all misconduct reports
exports.getAllMisconducts = async (req, res) => {
  try {
    const misconducts = await Misconduct.find()
      .populate('studentId', 'email')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      misconducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching misconduct reports",
      error: error.message
    });
  }
};

// Get misconduct reports for a specific student
exports.getStudentMisconducts = async (req, res) => {
  try {
    const { studentId } = req.params;
    const misconducts = await Misconduct.find({ studentId })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      misconducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student misconduct reports",
      error: error.message
    });
  }
}; 