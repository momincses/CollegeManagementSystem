const User = require("../models/usermodel");
const Complaint = require("../models/complaintModel");
const { isComplaintClean } = require("../utils/moderations");
const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Update with your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

/**
 * Event Controller
 * Handles all event-related operations
 */
  // Create new event request
  const getAllComplaints = async (req, res) => {
    console.log("i am in getAllComplaints")
    try {
      const userComplaints = await Complaint.find({});
      if (userComplaints.length === 0) {
        return res.status(404).json({ message: "No Complaint Registered Yet!" });
      }
      res.status(201).json({ message: userComplaints });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  }

//   Get all events (with optional filters)
  const getApprovedComplaints = async (req, res) => {
    console.log("in getapproved complainets")
    try {
    //   const { id } = req.params;
      const status = "approved";
      const userComplaints = await Complaint.find({ status });
      console.log(userComplaints);
      if (userComplaints.length === 0) {
        return res.status(404).json({ message: "No Complaint Registered Yet!" });
      }
      res.status(200).json(userComplaints);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
  }

  // Update event request status (admin only)
  const getFlaggedComplaints = async (req, res) => {
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
  }

  // Get event details by ID
  const getUserComplaints = async (req, res) => {
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
  }

  // Get event details by ID
  // const { isComplaintClean } = require('../utils/complaintUtils'); // Adjust path if needed
  // const Complaint = require('../models/Complaint'); // Adjust path if needed
  
  const RegisterComplaint = async (req, res) => {
      try {
          const { title, description, category, submitted_by } = req.body;
  
          // Validate input
          if (!title || !description || !category || !submitted_by) {
              return res.status(400).json({
                  success: false,
                  message: 'Please provide all required fields',
                  missingFields: {
                      title: !title,
                      description: !description,
                      category: !category,
                      submitted_by: !submitted_by
                  }
              });
          }
  
          // Check for inappropriate content
          const isClean = isComplaintClean(`${title} ${description}`);
  
          // Create new complaint with status based on content
          const newComplaint = new Complaint({
              title,
              description,
              category,
              status: isClean ? 'approved' : 'pending',
              submitted_by,
              moderation_status: isClean ? 'approved' : 'flag'
          });
  
          const savedComplaint = await newComplaint.save();
  
          if (!savedComplaint) {
              return res.status(400).json({
                  success: false,
                  message: 'Failed to save complaint'
              });
          }
  
          res.status(201).json({
              success: true,
              message: `Complaint ${isClean ? 'approved' : 'flagged for review'} successfully`,
              complaint: savedComplaint
          });
  
      } catch (error) {
          console.error('Server error in RegisterComplaint:', error);
          res.status(500).json({
              success: false,
              message: 'Internal server error while registering complaint',
              error: error.message
          });
      }
  };
  
  module.exports = { RegisterComplaint };
  

  // Get event details by ID
  const ModifyComplaint = async (req, res) => {
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
  }

  // Get event details by ID
  const DeleteComplaint = async (req, res) => {
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
  }

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Database connected successfully'))
// .catch((err) => console.error('Database connection error:', err));

module.exports = {getAllComplaints, DeleteComplaint, ModifyComplaint, getUserComplaints, RegisterComplaint, getFlaggedComplaints, getApprovedComplaints}