const mongoose = require("mongoose");

/**
 * Event Request Schema
 * Handles event requests from student coordinators
 */
const eventRequestSchema = new mongoose.Schema({
  // Basic Event Information
  eventName: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Other']
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expectedAttendees: {
    type: Number,
    required: true
  },

  // Budget Information
  budget: {
    items: [{
      description: String,  // Description of budget item
      amount: Number       // Cost of the item
    }],
    totalAmount: Number    // Total budget requested
  },

  // Contact Information
  organizerContact: {
    type: String,
    required: true
  },

  // Coordinator Information (references User model)
  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Request Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Admin Feedback
  adminComments: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
eventRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("EventRequest", eventRequestSchema); 