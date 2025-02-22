const express = require('express');
const router = express.Router();
const { addExpenditure, getEventExpenditures, deleteExpenditure } = require('../controllers/expenditureController');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/receipts',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Routes
router.post('/:eventId', verifyToken, upload.single('receipt'), addExpenditure);
router.get('/:eventId', verifyToken, getEventExpenditures);
router.delete('/:id', verifyToken, deleteExpenditure);

module.exports = router;