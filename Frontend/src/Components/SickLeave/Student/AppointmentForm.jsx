import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Stack } from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api";

const AppointmentForm = ({ studentEmail, onClose }) => {
  const [appointmentData, setAppointmentData] = useState({
    date: "",
    time: "",
    reason: "",
    studentEmail,
    guardianEmail: "",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentData.guardianEmail.includes("@")) {
      setError("Invalid guardian email format.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/student/book-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });
      if (res.ok) {
        onClose();
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to book appointment: " + err.message);
    }
  };

  return (
    <Card sx={{ width: 500, p: 3, bgcolor: "#e1f5fe" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: "#0d47a1" }}>
          Book Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Student Email" fullWidth value={studentEmail} disabled />
            <TextField
              label="Guardian Email"
              fullWidth
              value={appointmentData.guardianEmail}
              onChange={(e) => setAppointmentData({ ...appointmentData, guardianEmail: e.target.value })}
              required
              helperText="Must be a valid email address"
            />
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={appointmentData.date}
              onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
              required
            />
            <TextField
              label="Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={appointmentData.time}
              onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
              required
            />
            <TextField
              label="Reason"
              fullWidth
              multiline
              rows={3}
              value={appointmentData.reason}
              onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
              required
            />
            {error && (
              <Typography sx={{ color: "#b71c1c" }}>{error}</Typography>
            )}
            <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "#64b5f6", ":hover": { bgcolor: "#42a5f5" } }}>
              Book Appointment
            </Button>
            <Button variant="outlined" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
