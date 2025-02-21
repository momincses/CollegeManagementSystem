const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Create event request (student coordinator only)
router.post('/request', 
  verifyToken, 
  authorizeRoles('student-coordinator'), 
  eventController.createRequest
);

// Get all events (filtered by role)
router.get('/', 
  verifyToken, 
  eventController.getEvents
);

// Get specific event details
router.get('/:eventId', 
  verifyToken, 
  eventController.getEventById
);

// Update event status (admin only)
router.patch('/:eventId/status', 
  verifyToken, 
  authorizeRoles('admin'), 
  eventController.updateEventStatus
);

module.exports = router; 