const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    voteId: {
        type: String,
        required: true,
        unique: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    }
}, {
    timestamps: true
});

// Ensure one student can only vote once
voteSchema.index({ studentId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema); 