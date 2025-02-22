import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, List, ListItem, ListItemText, IconButton, Divider, Grid, Paper
} from '@mui/material';
import { Delete, CheckCircle, Cancel, Add, ListAlt } from '@mui/icons-material';

const AdminPanel = () => {
  const [facilities, setFacilities] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newFacility, setNewFacility] = useState({ name: '', description: '' });
  const [viewAll, setViewAll] = useState(false);

  const BASE_URL = "http://localhost:5000";
  const token = localStorage.getItem('authToken');

  const fetchFacilities = async () => {
    const res = await fetch(`${BASE_URL}/api/facility/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setFacilities(data.facilities);
      const allRequests = data.facilities.flatMap(fac =>
        fac.bookings
          .filter((b) => b.status === 'pending')
          .map((b) => ({ ...b, facilityName: fac.name, facilityId: fac._id }))
      );
      setRequests(allRequests);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleAddFacility = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/api/facility/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newFacility),
    });
    const data = await res.json();
    if (data.success) {
      setShowDialog(false);
      setNewFacility({ name: '', description: '' });
      fetchFacilities();
    } else alert(data.message);
  };

  const handleDeleteFacility = async (id) => {
    if (window.confirm('Delete this facility?')) {
      const res = await fetch(`${BASE_URL}/api/facility/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchFacilities();
      else alert(data.message);
    }
  };

  const handleUpdateStatus = async (facilityId, bookingId, status) => {
    const res = await fetch(`${BASE_URL}/api/facility/${facilityId}/booking/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) fetchFacilities();
    else alert(data.message);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Facility Management</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setShowDialog(true)}>
          Add Facility
        </Button>
        <Button
          variant="outlined"
          startIcon={<ListAlt />}
          onClick={() => setViewAll(!viewAll)}
        >
          {viewAll ? 'Back to Requests' : 'View All Facilities'}
        </Button>
      </Box>

      {/* Add Facility Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Add New Facility</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Facility Name" margin="dense" required
            value={newFacility.name}
            onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
          />
          <TextField
            fullWidth label="Description" margin="dense" multiline rows={3}
            value={newFacility.description}
            onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddFacility}>Add Facility</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Requests Section */}
      {!viewAll && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>Booking Requests</Typography>
          {requests.length === 0 ? (
            <Typography>No pending requests.</Typography>
          ) : (
            <List>
              {requests.map((req) => (
                <React.Fragment key={req._id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton color="success" onClick={() => handleUpdateStatus(req.facilityId, req._id, 'approved')}>
                          <CheckCircle />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleUpdateStatus(req.facilityId, req._id, 'rejected')}>
                          <Cancel />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={`${req.student?.name} requested ${req.facilityName}`}
                      secondary={`Date: ${new Date(req.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* All Facilities Section */}
      {viewAll && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>All Facilities</Typography>
          {facilities.length === 0 ? (
            <Typography>No facilities available.</Typography>
          ) : (
            <Grid container spacing={2}>
              {facilities.map((fac) => (
                <Grid item xs={12} md={6} lg={4} key={fac._id}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6">{fac.name}</Typography>
                    <Typography sx={{ mb: 2 }}>{fac.description || 'No description provided.'}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteFacility(fac._id)}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdminPanel;
