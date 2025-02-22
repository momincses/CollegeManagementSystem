import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActions, Typography } from '@mui/material';
import Button from '@mui/material/Button';

const BASE_URL = "http://localhost:5000";

const FacilityBookingPage = () => {
  const [facilities, setFacilities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/facility/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        const data = await response.json();
        setFacilities(data.facilities);
      } catch (err) {
        console.error('Error fetching facilities:', err);
      }
    };
    fetchFacilities();
  }, []);

  return (
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {facilities && facilities.length > 0 ? (
  facilities.map((facility) => (
    <Card key={facility._id} sx={{ borderRadius: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {facility.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {facility.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={() => navigate(`/student/facility/${facility._id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  ))
) : (
  <Typography variant="h6" color="text.secondary" align="center">
    No facilities available
  </Typography>
)}

    </div>
  );
};

export default FacilityBookingPage;
