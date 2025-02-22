const express = require("express");
const { bookAppointment, getTodayAppointments, getAppointmentsByStudentId } = require("../controllers/SickLeave/appointmentController");
const { allotLeave, getLeaveData } = require("../controllers/SickLeave/leaveController");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/student/book-appointment", verifyToken, authorizeRoles("student", "admin"), bookAppointment);
router.get("/doctor/all-appointment", verifyToken, authorizeRoles("doctor", "admin", "student"), getTodayAppointments);
router.get("/student/latest-appointment", verifyToken, authorizeRoles( "student"), getAppointmentsByStudentId);

router.post("/doctor/add-leave", verifyToken, authorizeRoles("doctor"), allotLeave);
router.get("/student/leave-data", verifyToken, authorizeRoles("student"), getLeaveData);
router.get("/coordinator/leave-data", verifyToken, authorizeRoles("classCoordinator"), getLeaveData);


module.exports = router;