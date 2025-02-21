import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Link,
  Alert,
} from "@mui/material";
import SquareLoader from "../../Loader/SquareLoader/SquareLoader";

const AdminInvitePage = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student-coordinator");
  const [invitationLink, setInvitationLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state added

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true); // Start loader
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/coordinator/admin/invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, role }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setInvitationLink(data.invitationLink);
        setSuccess("Invitation link generated successfully!");
      } else {
        setError(data.message || "Failed to generate invitation link");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  if(loading ) {
    return <SquareLoader/>;
  }

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
          Generate Invitation Link
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Recipient's Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Select Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          >
            <MenuItem value="student-coordinator">Student Coordinator</MenuItem>
            <MenuItem value="class-coordinator">Class Coordinator</MenuItem>
          </TextField>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              ":hover": { backgroundColor: "#1565c0" },
            }}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  border: "3px solid #fff",
                  borderRadius: "4px",
                  borderTopColor: "transparent",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : (
              "Send Invitation"
            )}
          </Button>
        </form>

        {success && <Alert sx={{ mt: 2 }} severity="success">{success}</Alert>}
        {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}

        {invitationLink && (
          <Box mt={3}>
            <Typography variant="subtitle1">Invitation Link:</Typography>
            <Link href={invitationLink} underline="hover" color="primary">
              {invitationLink}
            </Link>
          </Box>
        )}
      </Paper>

      
    </Box>
  );
};

export default AdminInvitePage;
