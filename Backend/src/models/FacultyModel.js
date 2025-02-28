const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const facultySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    default: 'faculty'
  }
});

// Hash password before saving
facultySchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
facultySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Faculty", facultySchema); 