import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

const SignupPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    branch: "",
    year: "",
    club: "",
  });
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      setRole(decoded.role);
    } catch (err) {
      console.error("Invalid token format");
      setError("Invalid invitation link.");
    }
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/coordinator/signup/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => navigate(`/${role}/login`), 2000);
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 5,
          borderRadius: 3,
          width: { xs: "90%", sm: "500px" },
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" mb={2} sx={{ color: "#333" }}>
          Signup - {role.replace("-", " ").toUpperCase()}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          {role === "class-coordinator" && (
            <>
              <TextField
                fullWidth
                label="Branch"
                name="branch"
                variant="outlined"
                value={formData.branch}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Year"
                name="year"
                variant="outlined"
                value={formData.year}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </>
          )}
          {role === "student-coordinator" && (
            <TextField
              fullWidth
              label="Club/Committee Name"
              name="club"
              variant="outlined"
              value={formData.club}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#1565c0" },
              mb: 2,
            }}
          >
            Register
          </Button>
        </form>

        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default SignupPage;
