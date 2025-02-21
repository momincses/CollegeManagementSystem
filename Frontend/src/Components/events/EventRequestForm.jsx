import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';
import SquareLoader from '../Loader/SquareLoader/SquareLoader';

// Available event types for the dropdown
const eventTypes = ['Academic', 'Cultural', 'Sports', 'Technical', 'Other'];

const EventRequestForm = () => {
  // Get current user context for coordinator ID
  const { user } = useAuth();

  // Main form state with budget management
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    date: '',
    venue: '',
    description: '',
    expectedAttendees: '',
    organizerContact: '',
    budget: {
      items: [],      // Array of budget items
      totalAmount: 0  // Running total of all items
    }
  });

  // Separate state for current budget item being added
  const [budgetItem, setBudgetItem] = useState({ description: '', amount: '' });
  
  // UI state management
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle changes in main form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add new item to budget list
  const handleAddBudgetItem = () => {
    if (budgetItem.description && budgetItem.amount) {
      const newItems = [...formData.budget.items, budgetItem];
      // Calculate new total
      const totalAmount = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
      
      // Update form data with new budget
      setFormData({
        ...formData,
        budget: {
          items: newItems,
          totalAmount
        }
      });
      // Reset budget item input
      setBudgetItem({ description: '', amount: '' });
    }
  };

  // Remove item from budget list
  const handleRemoveBudgetItem = (index) => {
    const newItems = formData.budget.items.filter((_, i) => i !== index);
    // Recalculate total after removal
    const totalAmount = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
    
    setFormData({
      ...formData,
      budget: {
        items: newItems,
        totalAmount
      }
    });
  };

  // Submit the entire form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/events/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          coordinatorId: user.id  // Add coordinator ID from auth context
        })
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form after successful submission
        setFormData({
          eventName: '',
          eventType: '',
          date: '',
          venue: '',
          description: '',
          expectedAttendees: '',
          organizerContact: '',
          budget: {
            items: [],
            totalAmount: 0
          }
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit event request');
      }
    } catch (err) {
      setError('Failed to submit event request');
    } finally {
      setLoading(false);
    }
  };

  // Show loader while submitting
  if (loading) return <SquareLoader />;

  // Form UI
  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      {/* Form Header */}
      <Typography variant="h5" gutterBottom>
        Submit Event Request
      </Typography>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Event request submitted successfully!
        </Alert>
      )}

      {/* Main Form */}
      <Box component="form" onSubmit={handleSubmit}>
        {/* Basic Event Details */}
        <TextField
          fullWidth
          label="Event Name"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Event Type Dropdown */}
        <TextField
          fullWidth
          select
          label="Event Type"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          margin="normal"
          required
        >
          {eventTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          required
          multiline
          rows={4}
        />

        <TextField
          fullWidth
          label="Expected Attendees"
          name="expectedAttendees"
          type="number"
          value={formData.expectedAttendees}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Organizer Contact"
          name="organizerContact"
          value={formData.organizerContact}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Budget Section */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Event Budget
        </Typography>
        
        {/* Budget Item Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Item Description"
            value={budgetItem.description}
            onChange={(e) => setBudgetItem({...budgetItem, description: e.target.value})}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Amount"
            type="number"
            value={budgetItem.amount}
            onChange={(e) => setBudgetItem({...budgetItem, amount: e.target.value})}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleAddBudgetItem}
            sx={{ mt: 1 }}
          >
            Add Item
          </Button>
        </Box>

        {/* Budget Items List */}
        <List>
          {formData.budget.items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.description}
                secondary={`₹${item.amount}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleRemoveBudgetItem(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {/* Total Budget Display */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Total Budget: ₹{formData.budget.totalAmount}
        </Typography>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Submit Request
        </Button>
      </Box>
    </Paper>
  );
};

export default EventRequestForm; 