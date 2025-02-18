import React, { useState } from "react";
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import styles from "./LoginSignupPage.module.css";
import SquareLoader from '../../Components/Loader/SquareLoader/SquareLoader'; // Assuming the SquareLoader component is imported
const API_BASE_URL = "http://localhost:5000/api/auth"; // Change this to your actual backend URL

const LoginForm = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Initialize useNavigate

  // Email validation regex for the format 2022bcs100@sggs.ac.in
  const emailRegex = /^[a-zA-Z0-9._%+-]+@sggs\.ac\.in$/;

  // Handle login
  const handleLogin = async () => {
    let isValid = true;
  
    // Email validation
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid college email ID");
      isValid = false;
    } else {
      setEmailError("");
    }
  
    // Password validation (for example, not empty)
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
  
    if (isValid) {
      setLoading(true); // Show loader when login is in progress
      try {
        // Here, replace this mock authentication with your backend call (e.g., Firebase authentication)
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // If login is successful, store the authToken
          localStorage.setItem("authToken", data.token); // Store the authToken
  
          // Redirect to home page after successful login
          navigate("/"); // Redirect to home page
        } else {
          // Handle error from backend (incorrect password or non-existing user)
          setDialogMessage(data.error || "Invalid credentials. Please check your email and password.");
          setDialogOpen(true);
        }
      } catch (error) {
        setDialogMessage("An error occurred while logging in. Please try again later.");
        setDialogOpen(true);
      } finally {
        setLoading(false); // Hide loader once the request is complete
      }
    }
  };
  

  return (
    <Box className={styles.form}>
      <Typography variant="h4" className={styles.title} sx={{ textAlign: "center" }}>
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!emailError} // Display error state if there's an error
        helperText={emailError} // Show error message
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError} // Display error state if there's an error
        helperText={passwordError} // Show error message
      />
      
      {loading ? ( // Display loader when loading is true
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <SquareLoader /> {/* Show SquareLoader here */}
        </Box>
      ) : (
        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: "#00308F", marginTop: "15px" }}
          onClick={handleLogin} // Trigger login validation on button click
        >
          Login
        </Button>
      )}

      <Box className={styles.footerButtons} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <Button sx={{ textTransform: "none", color: "gray" }}>
          <Typography variant="body1">Forgot Password?</Typography>
        </Button>
        <Button
          variant="text"
          onClick={toggleForm}
          sx={{
            width: "100%",
            marginTop: "20px",
            textTransform: "none",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" sx={{ color: "gray" }}>
            Don't have an account?{" "}
            <strong style={{ color: "black", backgroundColor: "#F0F8FF", padding: "5px 10px", borderRadius: "5px" }}>
              Create Account
            </strong>
          </Typography>
        </Button>
      </Box>

      {/* Error Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} sx={{padding:"20px"}}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#D32F2F" }}>
          Login Error
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", color: "#333", padding: "20px", fontSize: "16px" }}>
          {dialogMessage}
        </DialogContent>
        <Box sx={{ textAlign: "center", margin: "10px" }}>
          <Button variant="contained" sx={{ bgcolor: "#D32F2F" }} onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default LoginForm;
