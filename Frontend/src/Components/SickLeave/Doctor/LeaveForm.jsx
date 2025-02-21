import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, Grid } from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api";

const LeaveForm = ({ appointmentData, onClose }) => {
  const [leaveDetails, setLeaveDetails] = useState({
    startDate: "",
    endDate: "",
    reason: appointmentData?.reason || "",
    branch: "",
    year: "",
  });

  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    setLeaveDetails({ ...leaveDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/doctor/add-leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: appointmentData.studentId,
          studentName: appointmentData.studentName,
          studentEmail: appointmentData.studentEmail,
          guardianEmail: appointmentData.guardianEmail,
          time: appointmentData.time,
          branch: leaveDetails.branch,
          year: leaveDetails.year,
          startDate: leaveDetails.startDate,
          endDate: leaveDetails.endDate,
          reason: leaveDetails.reason,
        }),
      });

      if (!res.ok) throw new Error("Failed to allot leave");
      onClose();
    } catch (err) {
      console.error("Error allotting leave:", err);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          maxWidth: 500,
          mx: "auto",
          mt: 5,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Allot Sick Leave
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Read-only Fields */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Name"
                value={appointmentData?.studentName || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Email"
                value={appointmentData?.studentEmail || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Guardian Email"
                value={appointmentData?.guardianEmail || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appointment Time"
                value={appointmentData?.time || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Appointment Reason"
                value={appointmentData?.reason || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Editable Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch"
                name="branch"
                value={leaveDetails.branch}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                value={leaveDetails.year}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={leaveDetails.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={leaveDetails.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Leave Reason"
                name="reason"
                value={leaveDetails.reason}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default LeaveForm;
