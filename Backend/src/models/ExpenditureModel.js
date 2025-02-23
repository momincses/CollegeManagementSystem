const mongoose = require("mongoose");

const expenditureSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventDescription: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: Number,
      trim: true,
    },
    expenditures: [
      {
        amountSpent: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          trim: true,
        },
        receiptImageUrl: {
          type: String,
          trim: true,
        },
        updatedBy: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        dateOfUpdate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expenditure", expenditureSchema);
