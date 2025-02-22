import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const CreateExpenditure = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('amount', amount);
      if (receipt) {
        formData.append('receipt', receipt);
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/expenditures/${eventId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create expenditure');
      }

      setSuccess('Expenditure added successfully');
      setTimeout(() => navigate(`/expenditure/list/${eventId}`), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Expenditure
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setReceipt(e.target.files[0])}
          style={{ marginBottom: 16 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Add Expenditure
        </Button>
      </form>
    </Box>
  );
};

export default CreateExpenditure;