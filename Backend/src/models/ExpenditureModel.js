const expenditureSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventRequest',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  receiptImage: {
    type: String,  // URL to stored image
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}); 