const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
    addCandidate,
    getCandidates,
    submitVote,
    getResults,
    checkVoteStatus
} = require("../controllers/electionController");

// Admin routes
router.post("/candidate/add", verifyToken, authorizeRoles("admin"), addCandidate);
 
// Public routes
router.get("/candidates", getCandidates);
router.get("/results", getResults);

// Student routes
router.post("/vote", verifyToken, authorizeRoles("student", "admin"), submitVote);
router.get("/vote-status", verifyToken, authorizeRoles("student", "admin"), checkVoteStatus);

module.exports = router;