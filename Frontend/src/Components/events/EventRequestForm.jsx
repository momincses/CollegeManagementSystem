import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Alert, MenuItem,
  IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import SquareLoader from '../Loader/SquareLoader/SquareLoader';

// Available event types
const eventTypes = ['Academic', 'Cultural', 'Sports', 'Technical', 'Other'];

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

const EventRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '', eventType: '', date: '', venue: '', description: '',
    expectedAttendees: '', organizerContact: '', budget: { items: [], totalAmount: 0 }
  });
  const [budgetItem, setBudgetItem] = useState({ description: '', amount: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 🔑 Check for authentication
  useEffect(() => {
    const token = localStorage.getItem('coordinatorAuthToken');
    if (!token) {
      navigate('/coordinator/login');
    } else {
      const decodedUser = decodeToken(token);
      if (decodedUser && decodedUser.email && decodedUser.userId) {
        setUser(decodedUser);
      } else {
        localStorage.removeItem('coordinatorAuthToken');
        navigate('/coordinator/login');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBudgetItem = () => {
    if (budgetItem.description && budgetItem.amount) {
      const newItems = [...formData.budget.items, budgetItem];
      const totalAmount = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
      setFormData({ ...formData, budget: { items: newItems, totalAmount } });
      setBudgetItem({ description: '', amount: '' });
    }
  };

  const handleRemoveBudgetItem = (index) => {
    const newItems = formData.budget.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + Number(item.amount), 0);
    setFormData({ ...formData, budget: { items: newItems, totalAmount } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('coordinatorAuthToken');
      const response = await fetch('http://localhost:5000/api/events/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, coordinatorId: user.userId })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setFormData({
          eventName: '', eventType: '', date: '', venue: '', description: '',
          expectedAttendees: '', organizerContact: '', budget: { items: [], totalAmount: 0 }
        });
      } else {
        setError(data.message || 'Failed to submit event request');
      }
    } catch (err) {
      setError('Failed to submit event request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SquareLoader />;

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Submit Event Request</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Event request submitted successfully!</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField fullWidth label="Event Name" name="eventName" value={formData.eventName} onChange={handleChange} margin="normal" required />
        <TextField fullWidth select label="Event Type" name="eventType" value={formData.eventType} onChange={handleChange} margin="normal" required>
          {eventTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
        </TextField>
        <TextField fullWidth label="Date" name="date" type="date" value={formData.date} onChange={handleChange} margin="normal" required InputLabelProps={{ shrink: true }} />
        <TextField fullWidth label="Venue" name="venue" value={formData.venue} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" required multiline rows={4} />
        <TextField fullWidth label="Expected Attendees" name="expectedAttendees" type="number" value={formData.expectedAttendees} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Organizer Contact" name="organizerContact" value={formData.organizerContact} onChange={handleChange} margin="normal" required />

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Event Budget</Typography>
        <Box sx={{ mb: 3 }}>
          <TextField label="Item Description" value={budgetItem.description} onChange={(e) => setBudgetItem({ ...budgetItem, description: e.target.value })} sx={{ mr: 2 }} />
          <TextField label="Amount" type="number" value={budgetItem.amount} onChange={(e) => setBudgetItem({ ...budgetItem, amount: e.target.value })} sx={{ mr: 2 }} />
          <Button variant="contained" onClick={handleAddBudgetItem} sx={{ mt: 1 }}>Add Item</Button>
        </Box>

        <List>
          {formData.budget.items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item.description} secondary={`₹${item.amount}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleRemoveBudgetItem(index)}><DeleteIcon /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" sx={{ mt: 2 }}>Total Budget: ₹{formData.budget.totalAmount}</Typography>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>Submit Request</Button>
      </Box>
    </Paper>
  );
};

export default EventRequestForm;
