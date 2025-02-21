// 📁 controllers/appointmentController.js
const Appointment = require("../../models/SickLeave/Appointment");

exports.bookAppointment = async (req, res) => {
  try {
    const { date, time, reason, studentEmail, guardianEmail } = req.body;
    const appointment = await Appointment.create({
      studentId: req.user.id,
      date,
      time,
      reason,
      studentEmail,
      guardianEmail,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error });
  }
};

exports.getTodayAppointments = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
  
      const appointments = await Appointment.find({
        date: { $gte: today, $lt: tomorrow },
      });
  
      res.status(200).json(appointments);
      console.log(appointments);
    } catch (error) {
      res.status(500).json({ message: "Fetch failed", error });
    }
  };
  

// Fetch appointments by student ID
exports.getAppointmentsByStudentId = async (req, res) => {
    try {
      const studentId = req.user.id; // Assuming middleware adds user info to req.user
      const appointments = await Appointment.find({ studentId });
  
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ message: "No appointments found for this student." });
      }
  
      res.status(200).json(appointments);
      console.log(appointments)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments", error });
    }
  };