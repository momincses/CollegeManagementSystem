const express = require("express");
const router = express.Router();
const {
  getAllExpenditures,
  getExpenditureById,
  addExpenditureEntry,
} = require("../controllers/expenditureController");

// Get all expenditures
router.get("/", getAllExpenditures);

// Get a single expenditure by ID
router.get("/:id", getExpenditureById);

// Add expenditure entry (only student-coordinator allowed)
router.post("/:id/add-entry", addExpenditureEntry);

module.exports = router;