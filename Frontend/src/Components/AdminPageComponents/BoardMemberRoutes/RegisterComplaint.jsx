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
import SquareLoader from '../../Loader/SquareLoader/SquareLoader';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const eventTypes = ["Harassment", "Faculty Issue", "Campus Facility Issue"];
const API_BASE_URL = "http://localhost:5000/api/complaints";

const RegisterComplaint = () => {
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

    // ✅ Extract submitted_by from token on component load
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const id = decoded?.id;
                if (id) {
                    setFormData(prev => ({ ...prev, submitted_by: id }));
                } else {
                    console.error("User ID not found in token.");
                    setError("Authentication error: User ID missing.");
                }
            } catch (err) {
                console.error("Token decoding error:", err);
                setError("Invalid authentication token.");
            }
        } else {
            console.error("Token not found in localStorage.");
            setError("User not authenticated.");
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Submitting complaint...');

        try {
            setLoading(true);

            // ✅ Always extract submitted_by from token during submission
            const decoded = jwtDecode(token);
            const userId = decoded?.id;
            if (!userId) throw new Error("User ID missing in token.");

            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                submitted_by: userId,
                anonymous: formData.anonymous,
            };

            console.log("Payload being sent:", payload);

            await axios.post(`${API_BASE_URL}/register-complaint`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast.dismiss(loadingToast);
            toast.success('Complaint submitted successfully!');
            setSuccess(true);

            // ✅ Reset form but retain user ID
            setFormData(prev => ({
                title: '',
                description: '',
                category: '',
                submitted_by: userId,
                date: '',
                anonymous: false,
            }));

        } catch (error) {
            toast.dismiss(loadingToast);
            const errMsg = error.response?.data?.message || error.message || 'Error submitting complaint';
            setError(errMsg);
            toast.error(errMsg);
            console.error('Submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SquareLoader />;

    return (
        <div>
            <Toaster position="top-right" />
            <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Submit A Complaint
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Complaint submitted successfully!</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        fullWidth
                        select
                        label="Complaint Category"
                        name="category"
                        value={formData.category}
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

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.anonymous}
                                onChange={handleChange}
                                name="anonymous"
                            />
                        }
                        label="Submit Anonymously"
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                        Submit Complaint
                    </Button>
                </Box>
            </Paper>
        </div>
    );
};

export default RegisterComplaint;
