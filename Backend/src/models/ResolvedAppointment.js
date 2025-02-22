const mongoose = require("mongoose");

const resolvedAppointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentEmail: { type: String, required: true },
  guardianEmail: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["resolved"], default: "resolved" },
  resolvedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ResolvedAppointment", resolvedAppointmentSchema);
