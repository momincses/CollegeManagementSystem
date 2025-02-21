const Candidate = require("../models/Election/CandidateModel");
const Vote = require("../models/Election/VoteModel");
const { v4: uuidv4 } = require('uuid');

// Add candidate (Admin only)
const addCandidate = async (req, res) => {
    try {
        const { name, photoUrl, position, manifesto } = req.body;
        
        const candidate = new Candidate({
            candidateId: `CAND${Date.now()}`,
            name,
            photoUrl,
            position,
            manifesto
        });

        await candidate.save();
        res.status(201).json({ message: "Candidate added successfully", candidate });
    } catch (err) {
        res.status(500).json({ message: "Error adding candidate", error: err.message });
    }
};

// Get all candidates
const getCandidates = async (req, res) => {

    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (err) {
        res.status(500).json({ message: "Error fetching candidates", error: err.message });
    } 
};

// Submit vote
const submitVote = async (req, res) => {
    try {
        const { candidateId } = req.body;
        const studentId = req.user.id; // From auth middleware

        // Check if student has already voted
        const existingVote = await Vote.findOne({ studentId });
        if (existingVote) {
            return res.status(400).json({ message: "You have already voted" });
        }

        // Create vote record
        const vote = new Vote({
            voteId: `VOTE${Date.now()}`,
            studentId,
            candidateId
        });

        await vote.save();

        // Increment candidate's vote count
        await Candidate.findByIdAndUpdate(
            candidateId,
            { $inc: { votes: 1 } }
        );

        res.status(200).json({ message: "Vote submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error submitting vote", error: err.message });
    }
};

// Get election results
const getResults = async (req, res) => {
    try {
        const results = await Candidate.find().select('name position votes');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: "Error fetching results", error: err.message });
    }
};

// Check if student has voted
const checkVoteStatus = async (req, res) => {
    try {
        const studentId = req.user.id;
        const vote = await Vote.findOne({ studentId });
        res.status(200).json({ hasVoted: !!vote });
    } catch (err) {
        res.status(500).json({ message: "Error checking vote status", error: err.message });
    }
};

module.exports = {
    addCandidate,
    getCandidates,
    submitVote,
    getResults,
    checkVoteStatus
}; 