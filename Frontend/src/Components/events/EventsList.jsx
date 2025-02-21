import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import SquareLoader from '../Loader/SquareLoader/SquareLoader';

// Define colors for different event status chips
const statusColors = {
  pending: 'warning',   // Orange for pending events
  approved: 'success',  // Green for approved events
  rejected: 'error'     // Red for rejected events
};

const EventsList = () => {
  // Get current user context
  const { user } = useAuth();
  
  // State management
  const [events, setEvents] = useState([]); // Store all events
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedEvent, setSelectedEvent] = useState(null); // Store selected event for details view
  const [detailsOpen, setDetailsOpen] = useState(false); // Control dialog visibility

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to fetch events from backend
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching data
  if (loading) return <SquareLoader />;

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        Campus Events
      </Typography>

      {/* Grid of Event Cards */}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event._id}>
            <Card>
              <CardContent>
                {/* Event Basic Info */}
                <Typography variant="h6" gutterBottom>
                  {event.eventName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" paragraph>
                  {event.description.substring(0, 100)}... {/* Show truncated description */}
                </Typography>
                
                {/* Card Footer - Status and Action Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={event.status}
                    color={statusColors[event.status]}
                    size="small"
                  />
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      setSelectedEvent(event);
                      setDetailsOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Event Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.eventName}</DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>Event Details</Typography>
              
              {/* Event Details Grid */}
              <Grid container spacing={2}>
                {/* Left Column - Basic Details */}
                <Grid item xs={6}>
                  <Typography><strong>Type:</strong> {selectedEvent.eventType}</Typography>
                  <Typography><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</Typography>
                  <Typography><strong>Venue:</strong> {selectedEvent.venue}</Typography>
                  <Typography><strong>Expected Attendees:</strong> {selectedEvent.expectedAttendees}</Typography>
                </Grid>
                
                {/* Right Column - Status and Contact */}
                <Grid item xs={6}>
                  <Typography><strong>Status:</strong> 
                    <Chip 
                      label={selectedEvent.status}
                      color={statusColors[selectedEvent.status]}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography><strong>Contact:</strong> {selectedEvent.organizerContact}</Typography>
                </Grid>
                
                {/* Full Width - Description */}
                <Grid item xs={12}>
                  <Typography><strong>Description:</strong></Typography>
                  <Typography paragraph>{selectedEvent.description}</Typography>
                </Grid>
                
                {/* Budget Details Section */}
                {selectedEvent.budget && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Budget Details</Typography>
                    <Box sx={{ pl: 2 }}>
                      {/* List all budget items */}
                      {selectedEvent.budget.items.map((item, index) => (
                        <Typography key={index}>
                          {item.description}: ₹{item.amount}
                        </Typography>
                      ))}
                      {/* Show total budget */}
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        <strong>Total Budget:</strong> ₹{selectedEvent.budget.totalAmount}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EventsList; 