import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import SquareLoader from '../Loader/SquareLoader/SquareLoader';

const BASE_URL = "http://localhost:5000";

const StyledCard = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '15px',
  transition: 'transform 0.3s ease',
  '&:hover': { transform: 'scale(1.05)' },
}));

const LoaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
});

const FacilityBookingPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/facility/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched Facilities:", data);

        // ✅ Check response structure
        if (Array.isArray(data)) {
          setFacilities(data);
        } else if (data && Array.isArray(data.facilities)) {
          setFacilities(data.facilities);
        } else {
          console.warn("Unexpected data structure:", data);
          setFacilities([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  if (loading) {
    return (
      <LoaderContainer>
        <SquareLoader color="#5A67D8" size={60} />
      </LoaderContainer>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>Campus Facilities</Typography>
      <Grid container spacing={3}>
        {facilities.length > 0 ? (
          facilities.map((facility) => (
            <Grid item xs={12} sm={6} md={4} key={facility._id}>
              <StyledCard onClick={() => navigate(`/student/facility/${facility._id}`)}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{facility.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{facility.description}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary">
              No facilities available at the moment.
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <StyledCard onClick={() => navigate('/student/track-bookings')}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Track Your Booking Requests</Typography>
              <Typography variant="body2" color="text.secondary">
                View the status of your booking requests (Pending, Approved, Rejected)
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityBookingPage;
