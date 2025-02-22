const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { getAllComplaints, getApprovedComplaints, getFlaggedComplaints, getUserComplaints, RegisterComplaint, ModifyComplaint, DeleteComplaint } = require('../controllers/complaintController');

// Get all complaints (filtered by role)
router.get('/get-all-complaints', 
  verifyToken, 
  getAllComplaints
);

// Get approved complaints (filtered by role)
router.get('/get-approved-complaints',  
  verifyToken, 
  getApprovedComplaints
);

// Get flagged complaints (filtered by role)
router.get('/get-flagged-complaints', 
  verifyToken, 
  getFlaggedComplaints
);

// Get a users complaints (filtered by role)
router.get('/get-user-complaints/:id', 
  verifyToken, 
  getUserComplaints
);

// register a complaint
router.post('/register-complaint/:id', 
  verifyToken, 
  authorizeRoles('student'), 
  RegisterComplaint
);

// modify a complaint
router.put('/modify-complaint', 
  verifyToken, 
  authorizeRoles('board-member'), 
  ModifyComplaint
);

// delete a complaint
router.delete('/delete-complaint/:id', 
  verifyToken, 
  authorizeRoles('board-member'), 
  DeleteComplaint
);

module.exports = router;