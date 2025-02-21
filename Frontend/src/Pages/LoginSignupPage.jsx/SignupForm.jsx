import React, { useState } from "react";
import { TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, MenuItem } from "@mui/material";
import styles from "./LoginSignupPage.module.css";
import SquareLoader from "../../Components/Loader/SquareLoader/SquareLoader";

const API_BASE_URL = "http://localhost:5000/api/auth"; // Change this to your actual backend URL

const SignupForm = ({ toggleForm }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('student');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@sggs\.ac\.in$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

  // Function to open the dialog
  const handleOpenDialog = (message) => {
    setDialogMessage(message);
    setDialogOpen(true);
    setTimeout(() => setDialogOpen(false), 3000); // Auto-close after 2 sec
  };

  // Send OTP to email
  const sendOtp = async () => {
    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid college email ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        handleOpenDialog("OTP sent successfully! Check your email.");
        setEmailError("");
      } else {
        setEmailError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setIsLoading(false);
      setEmailError("Error sending OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setOtpError("Enter the OTP sent to your email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        console.log("OTP verified:", data.message);
        setOtpError("");
        setActiveStep(1); // Move to password step
      } else {
        setOtpError(data.error || "Invalid OTP");
      }
    } catch (error) {
      setIsLoading(false);
      setOtpError("Error verifying OTP");
    }
  };

  // Register User
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must contain at least 1 capital letter, 1 small letter, 1 special character, and be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        handleOpenDialog("Account created successfully!");
      } else {
        setPasswordError(data.error || "Registration failed");
      }
    } catch (error) {
      setIsLoading(false);
      setPasswordError("Error creating account");
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box className={styles.form}>
      <Typography variant="h4" className={styles.title} sx={{ textAlign: "center", marginBottom: "20px" }}>
        Create an Account
      </Typography>

      {activeStep === 0 && (
        <Box sx={{ marginBottom: "20px" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "5px" }}>
            <Button variant="contained" onClick={sendOtp} disabled={isLoading} sx={{ bgcolor: "#00308F", width: "150px" }}>
              {isLoading ? <SquareLoader size={24} /> : "Send OTP"}
            </Button>
          </Box>
          <TextField
            label="OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={!!otpError}
            helperText={otpError}
            disabled={isLoading}
          />
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="student-coordinator">Student Coordinator</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
        <Button variant="text" onClick={handleBack} disabled={activeStep === 0} sx={{ textTransform: "none", color: "gray" }}>
          Back
        </Button>
        <Button variant="contained" onClick={activeStep === 0 ? verifyOtp : handleSubmit} sx={{ bgcolor: "#00308F", width: "150px" }}>
          {activeStep === 0 ? "Verify" : "Submit"}
        </Button>
      </Box>

      <Box className={styles.footerButtons} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: "20px" }}>
        <Button variant="text" onClick={toggleForm} sx={{ width: "100%", marginTop: "20px", textTransform: "none", display: "flex", justifyContent: "center" }}>
          <Typography variant="body1" sx={{ color: "gray" }}>
            Already have an account?{" "}
            <strong style={{ color: "black", backgroundColor: "#F0F8FF", padding: "5px 10px", borderRadius: "5px" }}>
              Login
            </strong>
          </Typography>
        </Button>
      </Box>

      {/* OTP Sent & Success Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} sx={{ backdropFilter: "blur(4px)" }}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#2E8B57", animation: "fadeIn 0.5s" }}>
          Success 🎉
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", color: "#333", padding: "20px", fontSize: "16px" }}>
          {dialogMessage}
        </DialogContent>
        {dialogMessage.includes("account") && (
          <Box sx={{ textAlign: "center", marginTop: "10px" }}>
            <Button variant="contained" sx={{ bgcolor: "#2E8B57" }} onClick={toggleForm}>
              Login
            </Button>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default SignupForm;
