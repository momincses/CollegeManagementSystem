const mongoose = require("mongoose");

const misconductSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  examType: {
    type: String,
    required: true,
    enum: ['Mid Semester', 'End Semester', 'Quiz', 'Assignment', 'Other']
  },
  reason: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  additionalNotes: String,
  evidence: [String], // URLs to uploaded evidence files
}, {
  timestamps: true
});

module.exports = mongoose.model("Misconduct", misconductSchema); 