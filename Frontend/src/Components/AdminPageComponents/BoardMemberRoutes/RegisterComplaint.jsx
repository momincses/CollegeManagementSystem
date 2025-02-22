import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../../../contexts/AuthContext';
import SquareLoader from '../../Loader/SquareLoader/SquareLoader';

const eventTypes = ["Harassment", "Faculty Issue", "Campus Facility Issue"];
const API_BASE_URL = "http://localhost:5000/api/complaints";

const RegisterComplaint = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('authToken');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        submitted_by: '',
        date: '',
        anonymous: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (token) {
            const id = jwtDecode(token).id;
            setFormData((prev) => ({ ...prev, submitted_by: id }));
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            submitted_by: name === "anonymous" && checked ? null : prev.submitted_by
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => formPayload.append(key, formData[key]));

        try {
            const response = await fetch(
                `${API_BASE_URL}/register-complaint/${formData.submitted_by}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formPayload,
                }
            );

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    submitted_by:  formData.submitted_by,
                    date: '',
                    anonymous: false,
                });
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to submit complaint');
                setTimeout(() => setError(null), 5000);
            }
        } catch (err) {
            setError('Server error. Try again later.');
            setTimeout(() => setError(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SquareLoader />;

    return (
        <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Submit A Complaint
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Complaint submitted successfully!</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" multiline rows={4} required />
                
                <TextField fullWidth select label="Complaint Category" name="category" value={formData.category} onChange={handleChange} margin="normal" required>
                    {eventTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>

                <FormControlLabel control={<Checkbox checked={formData.anonymous} onChange={handleChange} name="anonymous" />} label="Submit Anonymously" />

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Submit Complaint
                </Button>
            </Box>
        </Paper>
    );
};

export default RegisterComplaint;
