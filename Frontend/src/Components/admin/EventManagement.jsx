import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import SquareLoader from '../Loader/SquareLoader/SquareLoader';

// Status chip color mapping
const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [adminComments, setAdminComments] = useState('');
  const [error, setError] = useState(null);

  // Fetch all event requests
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []); // Handle null or unexpected data
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(`Failed to fetch events: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          adminComments,
        }),
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, status: newStatus, adminComments }
              : event
          )
        );
        setDetailsOpen(false);
        setAdminComments('');
      } else {
        setError('Failed to update event status');
      }
    } catch (err) {
      setError('Failed to update event status');
    }
  };

  if (loading) return <SquareLoader />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Event Requests Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {events.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No event requests found.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Coordinator</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>{event.eventName || 'N/A'}</TableCell>
                  <TableCell>{event.eventType || 'N/A'}</TableCell>
                  <TableCell>
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {event.coordinatorId?.email || 'Not Available'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.status || 'pending'}
                      color={statusColors[event.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedEvent(event);
                        setDetailsOpen(true);
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Event Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              Event Request Details
              <Chip
                label={selectedEvent.status || 'pending'}
                color={statusColors[selectedEvent.status] || 'default'}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">
                  {selectedEvent.eventName || 'N/A'}
                </Typography>
                <Typography color="textSecondary">
                  Requested by: {selectedEvent.coordinatorId?.email || 'N/A'}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Type:</strong> {selectedEvent.eventType || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Date:</strong>{' '}
                    {selectedEvent.date
                      ? new Date(selectedEvent.date).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Venue:</strong> {selectedEvent.venue || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Expected Attendees:</strong>{' '}
                    {selectedEvent.expectedAttendees || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Description:</strong>
                  </Typography>
                  <Typography paragraph>
                    {selectedEvent.description || 'No description provided.'}
                  </Typography>
                </Grid>

                {/* Budget Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Budget Details
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(selectedEvent.budget?.items || []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={2} align="center">
                              No budget items provided.
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectedEvent.budget.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.description || 'N/A'}</TableCell>
                              <TableCell align="right">
                                ₹{item.amount || 0}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                        <TableRow>
                          <TableCell>
                            <strong>Total</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>
                              ₹
                              {selectedEvent.budget?.totalAmount || 0}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Admin Comments */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Admin Comments"
                    multiline
                    rows={4}
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedEvent.status === 'pending' && (
                <>
                  <Button
                    startIcon={<ApproveIcon />}
                    variant="contained"
                    color="success"
                    onClick={() =>
                      updateEventStatus(selectedEvent._id, 'approved')
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    startIcon={<RejectIcon />}
                    variant="contained"
                    color="error"
                    onClick={() =>
                      updateEventStatus(selectedEvent._id, 'rejected')
                    }
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EventManagement;
