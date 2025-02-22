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
router.post('/:facilityId/book', verifyToken, authorizeRoles('student', "admin"), facilityController.bookFacility);
router.get('/:facilityId/track', verifyToken, authorizeRoles('student', "admin"), facilityController.trackBookingStatus);

module.exports = router;
