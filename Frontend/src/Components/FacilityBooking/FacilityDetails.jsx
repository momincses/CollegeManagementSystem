// FacilityDetails.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import SquareLoader from '../Loader/SquareLoader/SquareLoader';

const BASE_URL = "http://localhost:5000";

const LoaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
});

const BookingInfoCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
}));

const FacilityDetails = () => {
  const { facilityId } = useParams();
  const [bookedDates, setBookedDates] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const fetchDates = async () => {
      const res = await fetch(`${BASE_URL}/api/facility/${facilityId}/track`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      const data = await res.json();
      setBookedDates(data.bookedDates);
      setLoading(false);
    };
    fetchDates();
  }, [facilityId]);

  const handleSearch = () => {
    if (searchDate) {
      const isBooked = bookedDates.includes(searchDate);
      setSearchResult(isBooked ? 'Not Available' : 'Available');
    } else {
      setSearchResult(null);
    }
  };

  const handleBooking = async () => {
    if (searchResult === 'Available') {
      const res = await fetch(`${BASE_URL}/api/facility/${facilityId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ date: searchDate }),
      });
      const data = await res.json();
      setBookingStatus(data.message || 'Booking request sent successfully.');
    }
  };

  if (loading) {
    return (
      <LoaderContainer>
        <SquareLoader color="#5A67D8" size={60} />
      </LoaderContainer>
    );
  }

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 3 }}>Facility Booking Details</Typography>
      <TextField
        label="Search Availability (yyyy-mm-dd)"
        variant="outlined"
        fullWidth
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {searchResult && (
        <BookingInfoCard>
          <Typography variant="h6">Date: {searchDate}</Typography>
          <Typography color={searchResult === 'Available' ? 'green' : 'red'}>
            {searchResult}
          </Typography>
          {searchResult === 'Available' && (
            <Button variant="contained" color="primary" onClick={handleBooking}>
              Book Now
            </Button>
          )}
          {bookingStatus && <Typography>{bookingStatus}</Typography>}
        </BookingInfoCard>
      )}
      <BookingInfoCard>
  <Typography variant="h6">Booked Dates</Typography>
  <ul>
    {Array.isArray(bookedDates) && bookedDates.length > 0 ? (
      bookedDates.map((date, index) => <li key={index}>{date}</li>)
    ) : (
      <Typography>No bookings available.</Typography>
    )}
  </ul>
</BookingInfoCard>

    </Container>
  );
};

export default FacilityDetails;
