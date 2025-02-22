import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error'
};

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }

      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!event) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Event not found
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {event.eventName}
        </Typography>

        <Chip 
          label={event.status}
          color={statusColors[event.status]}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Event Details</Typography>
            <Typography><strong>Type:</strong> {event.eventType}</Typography>
            <Typography><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</Typography>
            <Typography><strong>Venue:</strong> {event.venue}</Typography>
            <Typography><strong>Expected Attendees:</strong> {event.expectedAttendees}</Typography>
            <Typography><strong>Coordinator:</strong> {event.coordinatorId?.email}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography paragraph>{event.description}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Budget Details</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {event.budgetItems?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">₹{item.amount}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell><strong>Total Budget</strong></TableCell>
                    <TableCell align="right"><strong>₹{event.budget}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {event.adminComments && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Admin Comments</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography>{event.adminComments}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default EventDetail; 