const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true,
        enum: ['President', 'Vice President', 'Secretary', 'Treasurer']
    },
    manifesto: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Candidate", candidateSchema); 