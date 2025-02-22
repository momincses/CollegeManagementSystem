
// 📁 controllers/leaveController.js
const Leave = require("../../models/SickLeave/Leave");
const sendEmail = require("../../utils/Email");
const ResolvedAppointment = require("../../models/ResolvedAppointment");
const Appointment = require("../../models/SickLeave/Appointment"); 

// exports.allotLeave = async (req, res) => {
//   try {
//     const { studentId, startDate, endDate, reason, studentEmail, guardianEmail } = req.body;
//     const leave = await Leave.create({
//       studentId,
//       startDate,
//       endDate,
//       reason,
//       studentEmail,
//       guardianEmail,
//       approvedBy: req.user.id,
//     });
//     if (guardianEmail)
//       await sendEmail(
//         guardianEmail,
//         "Student Leave Notification",
//         `Leave from ${startDate} to ${endDate}. Reason: ${reason}`
//       );
//     res.status(201).json(leave);
//   } catch (error) {
//     res.status(500).json({ message: "Leave allotment failed", error });
//   }
// };
exports.allotLeave = async (req, res) => {
  try {
    const { studentId, startDate, endDate, reason, studentEmail, guardianEmail } = req.body;

    // 1. Allot leave
    const leave = await Leave.create({
      studentId,
      startDate,
      endDate,
      reason,
      studentEmail,
      guardianEmail,
      approvedBy: req.user.id,
    });

    // 2. Find and delete the appointment
    const appointment = await Appointment.findOneAndDelete({ studentId });
    console.log("deleted")
    if (appointment) {
      // 3. Save it in ResolvedAppointment
      await ResolvedAppointment.create({
        studentId: appointment.studentId,
        studentEmail: appointment.studentEmail,
        guardianEmail: appointment.guardianEmail,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
      });
    }
    console.log("created")

    // 4. Send email notification
    if (guardianEmail) {
      await sendEmail(
        guardianEmail,
        "Student Leave Notification",
        `Leave from ${startDate} to ${endDate}. Reason: ${reason}`
      );
    }

    res.status(201).json({ message: "Leave allotted and appointment resolved", leave });
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