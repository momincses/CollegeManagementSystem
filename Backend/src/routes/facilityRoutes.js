// 📁 routes/facilityRoutes.js
const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityBookingController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// 🏫 Admin Routes
router.post('/add', verifyToken, authorizeRoles('admin'), facilityController.addFacility);
router.delete('/:id', verifyToken, authorizeRoles('admin'), facilityController.deleteFacility);
router.put('/:facilityId/booking/:bookingId', verifyToken, authorizeRoles('admin'), facilityController.updateBookingStatus);

// 🎓 Student Routes
router.get('/all', verifyToken, facilityController.getAllFacilities);
router.post('/:facilityId/book', verifyToken, authorizeRoles("student", "admin"), facilityController.bookFacility);
router.get('/:facilityId/track', verifyToken, authorizeRoles("student", "admin"), facilityController.trackBookingStatus);
router.get('/:facilityId', verifyToken, authorizeRoles("student", "admin"), facilityController.getFacilityById);

const Facility = require('../models/Facility');
const User = require('../models/usermodel'); // Assuming this model exists

// GET facility details with populated email
router.get('/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id)
      .populate({
        path: 'bookings.student',
        select: 'email _id' // Only email and _id for registration number
      });
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(facility);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching facility details', error: err.message });
  }
});

module.exports = router;
