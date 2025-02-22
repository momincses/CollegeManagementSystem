import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Components/common/Modal';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const BudgetTracking = ({ eventId, userRole }) => {
  const [expenditures, setExpenditures] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [error, setError] = useState('');
  const { eventId: urlEventId } = useParams();

  const fetchExpenditures = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/expenditures/${urlEventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expenditures');
      }

      const data = await response.json();
      setExpenditures(data.expenditures);
      setTotalSpent(data.totalSpent);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/expenditures/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete expenditure');
      }

      fetchExpenditures(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchExpenditures();
  }, [urlEventId]);

  // Budget Summary Card Component
  const BudgetSummaryCard = () => (
    <div className="budget-summary-card">
      <div className="summary-item approved">
        <h4>Approved Budget</h4>
        <span>₹{event.budget.totalAmount}</span>
      </div>
      <div className="summary-item spent">
        <h4>Total Spent</h4>
        <span>₹{totalSpent}</span>
      </div>
      <div className="summary-item remaining">
        <h4>Remaining Budget</h4>
        <span>₹{event.budget.totalAmount - totalSpent}</span>
      </div>
    </div>
  );

  return (
    <div className="budget-tracking-container">
      <div className="header-section">
        <h2>Budget Tracking</h2>
        {/* Add Expenditure button only visible to coordinators */}
        {userRole === 'student-coordinator' && (
          <button 
            className="primary-btn add-btn"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus"></i> Add New Expenditure
          </button>
        )}
      </div>

      <BudgetSummaryCard />

      {/* Add New Expenditure Modal */}
      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Add New Expenditure"
        >
          <form onSubmit={handleSubmit} className="expenditure-form">
            <div className="form-group">
              <label>Description</label>
              <input 
                type="text" 
                placeholder="Enter description"
                required 
              />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                placeholder="Enter amount"
                min="0"
                required 
              />
            </div>
            <div className="form-group">
              <label>Upload Receipt</label>
              <div className="file-upload-container">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required 
                />
                <button type="button" className="upload-btn">
                  <i className="fas fa-upload"></i> Choose File
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="secondary-btn">
                Cancel
              </button>
              <button type="submit" className="primary-btn">
                Submit Expenditure
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Receipt View Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Receipt View"
        >
          <div className="receipt-view">
            <img src={selectedReceipt.receiptImage} alt="Receipt" />
            <div className="receipt-details">
              <p><strong>Description:</strong> {selectedReceipt.description}</p>
              <p><strong>Amount:</strong> ₹{selectedReceipt.amount}</p>
              <p><strong>Date:</strong> {new Date(selectedReceipt.date).toLocaleDateString()}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Expenditure List */}
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Expenditures
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="h6" gutterBottom>
          Total Spent: ₹{totalSpent}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenditures.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>₹{exp.amount}</TableCell>
                  <TableCell>{exp.submittedBy?.email}</TableCell>
                  <TableCell>
                    {new Date(exp.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDelete(exp._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Export/Print Section */}
      {/* <div className="export-section">
        <button 
          className="export-btn"
          onClick={handleExport}
        >
          <i className="fas fa-download"></i> Export Report
        </button>
        <button 
          className="print-btn"
          onClick={handlePrint}
        >
          <i className="fas fa-print"></i> Print Report
        </button>
      </div> */}
    </div>
  );
};

export default BudgetTracking; 