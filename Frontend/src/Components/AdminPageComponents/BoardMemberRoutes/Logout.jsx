import React, { useState } from 'react';
import {
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect

// import DeleteIcon from '@mui/icons-material/Delete';
// import { useAuth } from '../../../contexts/AuthContext';
// import SquareLoader from '../../Loader/SquareLoader';

const Logout = () => {
    //  Submit the entire form
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            if (token!==undefined || token!==null) {
                localStorage.removeItem("authToken");
                navigate("/login");
            } 
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div>
            {/* Total Budget Display */}
            <Typography variant="h6" sx={{ mt: 2 }}>
                Logout the session
            </Typography>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleSubmit}
            >
                Logout
            </Button>
        </div>
    )
}

export default Logout