
// 📁 controllers/leaveController.js
const Leave = require("../../models/SickLeave/Leave");
const sendEmail = require("../../utils/Email");

exports.allotLeave = async (req, res) => {
  try {
    const { studentId, startDate, endDate, reason, studentEmail, guardianEmail } = req.body;
    const leave = await Leave.create({
      studentId,
      startDate,
      endDate,
      reason,
      studentEmail,
      guardianEmail,
      approvedBy: req.user.id,
    });
    if (guardianEmail)
      await sendEmail(
        guardianEmail,
        "Student Leave Notification",
        `Leave from ${startDate} to ${endDate}. Reason: ${reason}`
      );
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Leave allotment failed", error });
  }
};

exports.getLeaveData = async (req, res) => {
  try {
    const studentId = req.user.role === "student" ? req.user.id : req.query.studentId;
    const leaves = await Leave.find({ studentId });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Leave data fetch failed", error });
  }
};