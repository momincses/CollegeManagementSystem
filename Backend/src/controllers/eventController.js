const EventRequest = require("../models/EventRequestModel");
const User = require("../models/UserModel");

/**
 * Event Controller
 * Handles all event-related operations
 */
const eventController = {
  // Create new event request
  createRequest: async (req, res) => {
    try {
      const { eventName, eventType, date, venue, description, expectedAttendees, budget, organizerContact } = req.body;
      
      // Verify user is a student coordinator
      const coordinator = await User.findById(req.user.id);
      if (coordinator.role !== 'student-coordinator') {
        return res.status(403).json({ message: 'Only student coordinators can create event requests' });
      }

      const eventRequest = new EventRequest({
        eventName,
        eventType,
        date,
        venue,
        description,
        expectedAttendees,
        budget,
        organizerContact,
        coordinatorId: req.user.id
      });

      await eventRequest.save();
      res.status(201).json({ message: 'Event request created successfully', eventRequest });
    } catch (error) {
      res.status(500).json({ message: 'Error creating event request', error: error.message });
    }
  },

  // Get all events (with optional filters)
  getEvents: async (req, res) => {
    try {
      const { status, type } = req.query;
      let query = {};

      // Apply filters if provided
      if (status) query.status = status;
      if (type) query.eventType = type;

      // If user is a coordinator, only show their events
      if (req.user.role === 'student-coordinator') {
        query.coordinatorId = req.user.id;
      }

      const events = await EventRequest.find(query)
        .populate('coordinatorId', 'email')
        .sort({ createdAt: -1 });

      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
  },

  // Update event request status (admin only)
  updateEventStatus: async (req, res) => {
    try {
      const { eventId } = req.params;
      const { status, adminComments } = req.body;

      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can update event status' });
      }

      const eventRequest = await EventRequest.findByIdAndUpdate(
        eventId,
        { status, adminComments },
        { new: true }
      );

      if (!eventRequest) {
        return res.status(404).json({ message: 'Event request not found' });
      }

      res.status(200).json({ message: 'Event status updated', eventRequest });
    } catch (error) {
      res.status(500).json({ message: 'Error updating event status', error: error.message });
    }
  },

  // Get event details by ID
  getEventById: async (req, res) => {
    try {
      const { eventId } = req.params;
      const event = await EventRequest.findById(eventId)
        .populate('coordinatorId', 'email');

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event details', error: error.message });
    }
  }
};

module.exports = eventController; 