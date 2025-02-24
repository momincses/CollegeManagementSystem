const Expenditure = require("../models/ExpenditureModel");

// Fetch all expenditures
const getAllExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.find();
    res.status(200).json({ expenditures });
  } catch (error) {
    console.error("Error fetching expenditures:", error);
    res.status(500).json({ message: "Failed to fetch expenditures" });
  }
};

// Fetch expenditure by ID
const getExpenditureById = async (req, res) => {
  try {
    const { id } = req.params;
    const expenditure = await Expenditure.findById(id);

    if (!expenditure) {
      return res.status(404).json({ message: "Expenditure not found" });
    }

    res.status(200).json({ expenditure });
  } catch (error) {
    console.error("Error fetching expenditure by ID:", error);
    res.status(500).json({ message: "Failed to fetch expenditure" });
  }
};

// Add expenditure entry (role: student-coordinator)
const StudentCoordinator = require("../models/StudentCoordinator"); // Import StudentCoordinator model

// Add expenditure entry (role: student-coordinator)
const addExpenditureEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { entries } = req.body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: "No expenditure entries provided" });
    }

    // Validate each entry
    for (const entry of entries) {
      if (!entry.amountSpent || !entry.updatedBy) {
        return res.status(400).json({ message: "Missing required fields in expenditure entry" });
      }
    }

    // Find expenditure record
    const expenditure = await Expenditure.findById(id);
    if (!expenditure) {
      return res.status(404).json({ message: "Expenditure record not found" });
    }

    // Add all new entries
    entries.forEach((entry) => {
      expenditure.expenditures.push({
        amountSpent: entry.amountSpent,
        description: entry.description || "",
        receiptImageUrl: entry.receiptImageUrl || "",
        updatedBy: entry.updatedBy,
        dateOfUpdate: entry.dateOfUpdate || new Date(),
      });
    });

    await expenditure.save();
    res.status(200).json({ message: "Expenditure entries added successfully", expenditure });
  } catch (error) {
    console.error("Error adding expenditure entry:", error);
    res.status(500).json({ message: "Failed to add expenditure entry", error: error.message });
  }
};

module.exports = { getAllExpenditures, getExpenditureById, deleteExpenditure,addExpenditureEntry }; 