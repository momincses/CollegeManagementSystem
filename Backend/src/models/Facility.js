// 📁 models/Facility.js
const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  facilityId: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated facility ID

  name: { type: String, required: true, unique: true },
  description: { type: String },
  bookings: [{
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);