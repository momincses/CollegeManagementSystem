import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import SquareLoader from "../../Loader/SquareLoader/SquareLoader";
import LeaveForm from "./LeaveForm";  // Import LeaveForm

const API_BASE_URL = "http://localhost:5000/api";

const DoctorSickLeave = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const token = localStorage.getItem("authToken");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/doctor/all-appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data);
      console.log(data)
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };


  const handleAllotLeave = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleFormClose = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <SquareLoader />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#0d47a1" }}>
        Today's Appointments
      </Typography>
      {appointments.length === 0 ? (
        <Typography>No appointments scheduled for today.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#e3f2fd" }}>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Guardian Email</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.studentName}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>{appointment.guardianEmail}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#64b5f6", ":hover": { bgcolor: "#42a5f5" } }}
                      onClick={() => handleAllotLeave(appointment)}
                    >
                      Allot Leave
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {modalOpen && selectedAppointment && (
        <LeaveForm appointmentData={selectedAppointment} onClose={handleFormClose} />
      )}
    </Box>
  );
};

export default DoctorSickLeave;
