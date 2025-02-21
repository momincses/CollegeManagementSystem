import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Modal,
  Divider,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import SquareLoader from "../../Loader/SquareLoader/SquareLoader";
import AppointmentForm from "./AppointmentForm";

const API_BASE_URL = "http://localhost:5000/api";

const StudentSickLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("authToken");
  const decodedToken = jwtDecode(token);
  const studentEmail = decodedToken.email;

  useEffect(() => {
    fetchLeaves();
    fetchLatestAppointment();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/student/leave-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestAppointment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/student/latest-appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLatestAppointment(data[0]);
    } catch (err) {
      console.error("Failed to fetch appointment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latestAppointment) {
      console.log(latestAppointment);
    }
  }, [latestAppointment]);

  if (loading) {
    return <SquareLoader />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "center", md: "flex-start" },
        justifyContent: "center",
        width: "100%",
        gap: 4,
        p: 1,
        boxSizing: 'border-box',

      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "#f3f6f9",
          boxShadow: 3,
          borderRadius: 3,
          p: 2,
          boxSizing: 'border-box',

        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ color: "#0d47a1", mb: 2 }}>
            Allotted Leaves
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {leaves.length === 0 ? (
            <Typography>No leaves allotted.</Typography>
          ) : (
            <Stack spacing={2}>
              {leaves.map((leave) => (
                <Card
                  key={leave._id}
                  sx={{
                    bgcolor: "#e8f5e9",
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <CardContent>
                    <Typography>
                      <strong>From:</strong> {" "}
                      {new Date(leave.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>To:</strong> {" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Reason:</strong> {leave.reason}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "#f3f6f9",
          boxShadow: 3,
          borderRadius: 3,
          p: 2,
          boxSizing: 'border-box',

        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ color: "#0d47a1", mb: 2 }}>
            Latest Appointment Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {latestAppointment ? (
            <Stack spacing={1}>
              <Typography>
                <strong>Date:</strong> {latestAppointment.date}
              </Typography>
              <Typography>
                <strong>Time:</strong> {latestAppointment.time}
              </Typography>
              <Typography>
                <strong>Reason:</strong> {latestAppointment.reason}
              </Typography>
              <Typography>
                <strong>Guardian Email:</strong> {latestAppointment.guardianEmail}
              </Typography>
            </Stack>
          ) : (
            <>
              <Typography>No appointment booked yet.</Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#64b5f6",
                  ":hover": { bgcolor: "#42a5f5" },
                }}
                onClick={() => setModalOpen(true)}
              >
                Book Appointment
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <AppointmentForm
          studentEmail={studentEmail}
          onClose={() => {
            setModalOpen(false);
            fetchLeaves();
            fetchLatestAppointment();
          }}
        />
      </Modal>
    </Box>
  );
};

export default StudentSickLeave;
