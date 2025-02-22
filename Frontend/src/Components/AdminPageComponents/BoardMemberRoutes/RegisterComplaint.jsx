import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    MenuItem,
} from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../../../contexts/AuthContext';
import SquareLoader from '../../Loader/SquareLoader/SquareLoader';

// Available event types for the dropdown
const eventTypes = ["Harassment", "Faculty Issue", "Campus Facility Issue"];
const API_BASE_URL = "http://localhost:5000/api/events";

const RegisterComplaint = () => {
    // Get current user context for coordinator ID
    const { user } = useAuth();

    // Main form state with budget management
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        submitted_by: '',
        date: '',
        status: "",                 // filled in backend    
        moderation_status: ""       // filled in backend
    });

    // UI state management
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Handle changes in main form fields
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Submit the entire form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(error);
        const token = localStorage.getItem('authToken');
        setLoading(true);
        try {
            formData.date = new Date();
            const id = jwtDecode(token).id;
            formData.submitted_by = id;
            // console.log(id);
            // return;
            const response = await fetch(`${API_BASE_URL}/register-complaint/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                })
            });

            if (response.ok) {
                setSuccess(true);
                // Reset form after successful submission
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    submitted_by: '',
                    status: "",
                    date: '',
                    moderation_status: ""
                });
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to submit event request');
            }
        } catch (err) {
            setError('Failed to submit event request');
        } finally {
            setLoading(false);
        }
    };

    // Show loader while submitting
    if (loading) return <SquareLoader />;

    // Form UI
    return (
        <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
            {/* Form Header */}
            <Typography variant="h5" gutterBottom>
                Submit A Complaint
            </Typography>

            {/* Status Messages */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Event request submitted successfully!
                </Alert>
            )}

            {/* Main Form */}
            <Box component="form" onSubmit={handleSubmit}>
                {/* Complaint title Details */}
                <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.eventTitle}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                {/* description */}
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.complaintDescription}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                />

                {/* Event Type Dropdown */}
                <TextField
                    fullWidth
                    select
                    label="Complaint Category"
                    name="category"
                    value={formData.eventType}
                    onChange={handleChange}
                    margin="normal"
                    required
                >
                    {eventTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Submit Complaint
                </Button>
            </Box>
        </Paper>
    );
};

export default RegisterComplaint; 
