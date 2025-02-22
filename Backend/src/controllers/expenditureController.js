const addExpenditure = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { description, amount } = req.body;
    const receiptImage = req.file.path; // Assuming file upload middleware

    // Verify event exists and is approved
    const event = await EventRequest.findById(eventId);
    if (!event || event.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or unapproved event' });
    }

    const expenditure = await Expenditure.create({
      eventId,
      description,
      amount,
      receiptImage
    });

    res.status(201).json(expenditure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventExpenditures = async (req, res) => {
  try {
    const { eventId } = req.params;
    const expenditures = await Expenditure.find({ eventId });
    
    // Calculate totals
    const totalSpent = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
    
    res.json({ expenditures, totalSpent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 