import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId, // Reference to 'users' collection
      ref: "User",
      required: true,
      unique: true
    },
    name: { type: String, required: true },
    specialization: { type: String, required: true }, // e.g., General Physician
    phoneNumber: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    locationInCampus: { type: String, required: true } // e.g., "Clinic Room 101"
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
