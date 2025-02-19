import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  Paper
} from '@mui/material';

const positions = ['President', 'Vice President', 'Secretary', 'Treasurer'];

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    position: '',
    department: '',
    semester: '',
    manifesto: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/election/candidate/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          photoUrl: '',
          position: '',
          department: '',
          semester: '',
          manifesto: ''
        });
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to add candidate');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New Candidate
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Candidate added successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Photo URL"
          name="photoUrl"
          value={formData.photoUrl}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          select
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          margin="normal"
          required
        >
          {positions.map((position) => (
            <MenuItem key={position} value={position}>
              {position}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Semester"
          name="semester"
          type="number"
          value={formData.semester}
          onChange={handleChange}
          margin="normal"
          required
          InputProps={{ inputProps: { min: 1, max: 8 } }}
        />

        <TextField
          fullWidth
          label="Manifesto"
          name="manifesto"
          value={formData.manifesto}
          onChange={handleChange}
          margin="normal"
          required
          multiline
          rows={4}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Add Candidate
        </Button>
      </Box>
    </Paper>
  );
};

export default CandidateForm; 