import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    uid: {
      // Reference to 'users' collection
      // for linking the users collection to this collection

      type: mongoose.Schema.Types.ObjectId,
      ref: "UserUser",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    address: { type: String }, // Optional field
    branch: { type: String, required: true },
    currentYear: { type: Number, required: true, enum: [1, 2, 3, 4] },
    registrationNumber: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    emergencyContact: { type: String, required: true },
    emergencyEmail: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
