const express = require("express");
const {  loginStudentCoordinator, loginClassCoordinator, signupWithInvitation } = require("../controllers/coordinatorController");
const verifyToken = require("../middleware/authMiddleware");
const  authorizeRoles  = require("../middleware/roleMiddleware");
const { generateInvitationLink } = require("../controllers/adminController");

const router = express.Router();

// Admin-only: Generate invitation link
router.post("/admin/invite", verifyToken, authorizeRoles("admin"), generateInvitationLink);

// Signup using invitation link
router.post("/signup/:token", signupWithInvitation);

// Student Coordinator Routes
router.post("/student-coordinator/login", loginStudentCoordinator);

// Class Coordinator Routes
router.post("/class-coordinator/login", loginClassCoordinator);

// Example protected route
router.get("/student-coordinator/dashboard", verifyToken, authorizeRoles("student-coordinator"), (req, res) => {
  res.json({ message: "Welcome Student Coordinator" });
});

router.get("/class-coordinator/dashboard", verifyToken, authorizeRoles("class-coordinator"), (req, res) => {
  res.json({ message: "Welcome Class Coordinator" });
});

module.exports = router;
