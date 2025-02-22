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
import { Link } from 'react-router-dom';

// Define colors for different event status chips
const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const EventsList = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SquareLoader />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f9f9f9', width: '100%' }}>
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold' }}>
          Campus Events
        </Typography>
        <Button
          component={Link}
          to="/student/student-coordinator/event-request"
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': { backgroundColor: '#115293' },
            borderRadius: '25px',
            px: 3,
            py: 1,
          }}
        >
          Request Event
        </Button>
      </Box>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-5px)' },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: '600' }}>
                  {event.eventName}
                </Typography>
                <Typography color="textSecondary">
                  {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                  {event.description.substring(0, 100)}...
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Chip
                    label={event.status}
                    color={statusColors[event.status]}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: '20px' }}
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
  PaperProps={{
    sx: {
      borderRadius: 4,
      backgroundColor: '#f9fafb', // Soft background color
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    },
  }}
>
  {selectedEvent && (
    <>
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: '1.8rem',
          color: '#2c3e50',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {selectedEvent.eventName}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: '#34495e', fontWeight: '600' }}
        >
          Event Details
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: '#555', mb: 1 }}>
              <strong>📅 Type:</strong> {selectedEvent.eventType}
            </Typography>
            <Typography sx={{ color: '#555', mb: 1 }}>
              <strong>🗓️ Date:</strong>{' '}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </Typography>
            <Typography sx={{ color: '#555', mb: 1 }}>
              <strong>📍 Venue:</strong> {selectedEvent.venue}
            </Typography>
            <Typography sx={{ color: '#555' }}>
              <strong>👥 Attendees:</strong> {selectedEvent.expectedAttendees}
            </Typography>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: '#555', mb: 1 }}>
              <strong>🔖 Status:</strong>
              <Chip
                label={selectedEvent.status}
                color={statusColors[selectedEvent.status]}
                size="small"
                sx={{
                  ml: 1,
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  px: 1,
                }}
              />
            </Typography>
            <Typography sx={{ color: '#555' }}>
              <strong>📞 Contact:</strong> {selectedEvent.organizerContact}
            </Typography>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: '600', color: '#34495e', mb: 1 }}
            >
              📖 Description:
            </Typography>
            <Typography sx={{ color: '#666', lineHeight: 1.7 }}>
              {selectedEvent.description}
            </Typography>
          </Grid>

          {/* Budget Section */}
          {selectedEvent.budget && (
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  color: '#2c3e50',
                  fontWeight: '600',
                  mb: 2,
                  borderBottom: '1px dashed #dcdcdc',
                  pb: 1,
                }}
              >
                💰 Budget Details
              </Typography>
              <Box sx={{ pl: 2 }}>
                {selectedEvent.budget.items.map((item, index) => (
                  <Typography key={index} sx={{ color: '#555', mb: 1 }}>
                    • {item.description}: <strong>₹{item.amount}</strong>
                  </Typography>
                ))}
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    color: '#1abc9c',
                    fontSize: '1.2rem',
                  }}
                >
                  Total Budget: ₹{selectedEvent.budget.totalAmount}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          backgroundColor: '#f1f1f1',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Button
          onClick={() => setDetailsOpen(false)}
          variant="contained"
          sx={{
            backgroundColor: '#3498db',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#2980b9',
            },
            px: 4,
            py: 1,
            fontWeight: 'bold',
            borderRadius: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>

    </Box>
  );
};

export default EventsList;
