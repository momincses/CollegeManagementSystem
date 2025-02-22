const EventRequest = require("../models/EventRequestModel.js");
const User = require("../models/usermodel.js");
const Complaint = require("../models/complaintModel.js");
const { isComplaintClean } = require("../utils/moderation.js");
const mongoose = require("mongoose");

/**
 * Event Controller
 * Handles all event-related operations
 */
const eventController = {
  // Create new event request
  getAllComplaints: async (req, res) => {
    try {
      const userComplaints = await Complaint.find({});
      if (userComplaints.length === 0) {
        return res.status(404).json({ message: "No Complaint Registered Yet!" });
      }
      res.status(201).json({ message: userComplaints });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  },

  // Get all events (with optional filters)
  getApprovedComplaints: async (req, res) => {
    try {
      const { id } = req.params;
      const status = "public";
      const userComplaints = await Complaint.find({ status });
      if (userComplaints.length === 0) {
        return res.status(404).json({ message: "No Complaint Registered Yet!" });
      }
      res.status(200).json(userComplaints);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  },

  // Update event request status (admin only)
  getFlaggedComplaints: async (req, res) => {
    try {
      const { id } = req.params;
      const status = "flagged";
      const userComplaints = await Complaint.find({ status });
      if (userComplaints.length === 0) {
        return res.status(404).json({ message: "No Complaint Registered Yet!" });
      }
      res.status(200).json(userComplaints);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  },

  // Get event details by ID
  getUserComplaints: async (req, res) => {
    try {
      const { id } = req.params;
      const userComplaints = await Complaint.find({ submitted_by: new mongoose.Types.ObjectId(id) });
      if (userComplaints.length === 0) {
        return res.status(404).json({ message: "No Complaint Registered Yet!" });
      }

      res.status(200).json(userComplaints);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  },

  // Get event details by ID
  RegisterComplaint: async (req, res) => {
    try {
      const { id } = req.params;
      let {
        title,
        description,
        category,
        status,
        submitted_by,
        moderation_status,

      } = req.body;
      const user = await User.findById({ _id: new mongoose.Types.ObjectId(id) });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let checkAppropriateComplaint = isComplaintClean(description);
      moderation_status = checkAppropriateComplaint ? "approved" : "flagged";
      status = checkAppropriateComplaint ? "public" : "flagged";

      const newComplaint = new Complaint({
        title,
        description,
        category,
        status,
        submitted_by,
        moderation_status,
      });

      await newComplaint.save();
      res.status(200).json({ "msg": "success" });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  },

  // Get event details by ID
  ModifyComplaint: async (req, res) => {
    try {
      // const { id } = req.params;
      let {
        _id,
        title,
        description,
        category,
        status,
        moderation_status,
      } = req.body;
      const complaint = await Complaint.findById({ _id: new mongoose.Types.ObjectId(_id) });
      
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      await Complaint.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(_id) },
        { title, description, category, status, moderation_status },
        { new: true }  // Return updated document
      );

      res.status(200).json({ "msg": "success" });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  },

  // Get event details by ID
  DeleteComplaint: async (req, res) => {
    try {
      const { id } = req.params;
      const complaint = await Complaint.findById({ _id: new mongoose.Types.ObjectId(id) });

      if (!complaint) {
        return res.status(404).json({ message: 'User not found' });
      }

      await Complaint.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) });

      res.status(200).json({ "msg": "success" });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  },
};

module.exports = eventController;