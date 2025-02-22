import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

const BASE_URL = "http://localhost:5000";

const FacilityDetails = () => {
  const { facilityId } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/facility/${facilityId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        const data = await response.json();
        if (data) setFacility(data);
        console.log(data);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilityDetails();
  }, [facilityId]);

  const handleBooking = async () => {
    const { name, startTime, endTime } = bookingForm;
    if (!name || !startTime || !endTime) {
      alert('Please fill all required fields!');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/facility/${facilityId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ ...bookingForm, date: selectedDate }),
      });
      if (response.ok) {
        alert('Booking request submitted!');
        setFormOpen(false);
        setBookingForm({ name: '', email: '', startTime: '', endTime: '' });
      } else {
        console.error('Failed to book facility.');
      }
    } catch (err) {
      console.error('Error booking facility:', err);
    }
  };

  const generateTwoMonthDates = () => {
    const today = new Date();
    const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const dates = [];
    for (let day = new Date(today); day <= twoMonthsLater; day.setDate(day.getDate() + 1)) {
      dates.push(new Date(day));
    }
    return dates;
  };

  const getBookingStatusColor = (day) => {
    const booking = facility?.bookings.find((b) => new Date(b.date).toDateString() === day.toDateString());
    if (booking) {
      if (booking.status === 'approved') return '#ffb3b3'; // Light red (Approved)
      if (booking.status === 'pending') return '#ffd699';  // Light orange (Pending)
      return '#f0f0f0'; // Light gray for rejected/completed
    }
    return '#d4edda'; // Light green (Available)
  };
  

  const renderCalendar = () => (
    <Grid container spacing={1} justifyContent="center" sx={{ gap: '5px' }}>
      {generateTwoMonthDates().map((day) => (
        <Grid
          item
          xs={"30%"}
          sm={4}
          md={2}
          lg={1}
          key={day.toISOString()}
          style={{
            backgroundColor: getBookingStatusColor(day),
            padding: '20px',
            minHeight: '100px',
            minWidth: '100px',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s, background-color 0.3s',
            cursor: getBookingStatusColor(day) === '#d4edda' ? 'pointer' : 'not-allowed',
          }}
          onClick={() => getBookingStatusColor(day) === '#d4edda' && handleDateClick(day)}
          onMouseEnter={(e) => {
            if (getBookingStatusColor(day) === '#d4edda') e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
  
  const handleDateClick = (day) => {
    setSelectedDate(day);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!facility) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">Facility details not found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {facility.name || 'Unnamed Facility'}
      </Typography>
      <Typography variant="body1" paragraph>
        {facility.description || 'No description available.'}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Booking Calendar
      </Typography>
      {renderCalendar()}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)}>
        <DialogTitle>Book for {selectedDate?.toDateString()}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            required
            label="Student Name"
            value={bookingForm.name}
            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Student Email"
            type="email"
            value={bookingForm.email}
            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            required
            label="Start Time"
            type="time"
            value={bookingForm.startTime}
            onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            required
            label="End Time"
            type="time"
            value={bookingForm.endTime}
            onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleBooking}>
            Submit Booking
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FacilityDetails;
