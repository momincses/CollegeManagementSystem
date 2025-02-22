const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    complaint_id: { type: String },
    board_member_id: { type: String },
    votes: { type: Number },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("reveal_votes", userSchema);
