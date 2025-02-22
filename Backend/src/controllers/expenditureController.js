const EventRequest = require("../models/EventRequestModel");
const Expenditure = require("../models/ExpenditureModel"); // Make sure this model exists

// Add expenditure
const addExpenditure = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { description, amount } = req.body;
    const receiptImage = req.file?.path; // Make optional

    // Verify event exists and is approved
    const event = await EventRequest.findById(eventId);
    if (!event || event.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or unapproved event' });
    }

    const expenditure = await Expenditure.create({
      eventId,
      description,
      amount,
      receiptImage,
      submittedBy: req.user.id // Add user reference
    });

    res.status(201).json(expenditure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get expenditures for an event
const getEventExpenditures = async (req, res) => {
  try {
    const { eventId } = req.params;
    const expenditures = await Expenditure.find({ eventId })
      .populate('submittedBy', 'name email'); // Add user details
    
    // Calculate totals
    const totalSpent = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
    
    res.json({ expenditures, totalSpent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete expenditure
const deleteExpenditure = async (req, res) => {
  try {
    const { id } = req.params;
    const expenditure = await Expenditure.findById(id);
    
    if (!expenditure) {
      return res.status(404).json({ message: 'Expenditure not found' });
    }

    // Check if user has permission
    if (expenditure.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await expenditure.remove();
    res.json({ message: 'Expenditure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addExpenditure, getEventExpenditures, deleteExpenditure }; 