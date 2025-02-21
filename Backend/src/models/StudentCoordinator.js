const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentCoordinatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  club: { type: String, required: true },
});

// Hash password before saving
studentCoordinatorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
studentCoordinatorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("StudentCoordinator", studentCoordinatorSchema);
