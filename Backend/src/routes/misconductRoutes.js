const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  reportMisconduct,
  getAllMisconducts,
  getStudentMisconducts
} = require("../controllers/misconductController");

// Faculty can report misconduct
router.post("/report", verifyToken, authorizeRoles("faculty"), reportMisconduct);

// Anyone can view misconduct reports
router.get("/all", verifyToken, getAllMisconducts);

// Get misconduct reports for specific student
router.get("/student/:studentId", verifyToken, getStudentMisconducts);

module.exports = router; 