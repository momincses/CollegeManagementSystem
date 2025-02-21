import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const BudgetTracking = ({ eventId, userRole }) => {
  const [expenditures, setExpenditures] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchExpenditures = async () => {
    try {
      const response = await axios.get(`/api/events/${eventId}/expenditures`);
      setExpenditures(response.data.expenditures);
      setTotalSpent(response.data.totalSpent);
    } catch (error) {
      console.error('Failed to fetch expenditures:', error);
    }
  };

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
      <div className="expenditure-list">
        <h3>Expenditure History</h3>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : expenditures.length === 0 ? (
          <div className="no-data">No expenditures recorded yet</div>
        ) : (
          expenditures.map(exp => (
            <div key={exp._id} className="expenditure-card">
              <div className="exp-details">
                <h4>{exp.description}</h4>
                <p className="amount">₹{exp.amount}</p>
                <p className="date">{new Date(exp.date).toLocaleDateString()}</p>
              </div>
              <div className="exp-actions">
                <button 
                  className="view-btn"
                  onClick={() => setSelectedReceipt(exp)}
                >
                  <i className="fas fa-eye"></i> View Receipt
                </button>
                {userRole === 'student-coordinator' && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(exp._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export/Print Section */}
      <div className="export-section">
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
      </div>
    </div>
  );
};

export default BudgetTracking; 