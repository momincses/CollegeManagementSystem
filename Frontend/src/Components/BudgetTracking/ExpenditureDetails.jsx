import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AddExpenditureForm from "./AddExpenditureForm";
import SquareLoader from "../Loader/SquareLoader/SquareLoader";

// MUI Components
import {
  Box,
  Typography,
  Button,
  Paper,
  Modal,
  Divider,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const BASE_URL = "http://localhost:5000";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ExpenditureDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expenditure, setExpenditure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch expenditure details
  useEffect(() => {
    const fetchExpenditure = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/expenditures/${id}`);
        setExpenditure(data.expenditure);
      } catch (error) {
        console.error("Error fetching expenditure:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenditure();
  }, [id]);

  // Check and decode token
  useEffect(() => {
    const token = localStorage.getItem("coordinatorAuthToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("coordinatorAuthToken");
        navigate("/coordinator/student-coordinator/login");
      }
    } else {
      navigate("/coordinator/student-coordinator/login");
    }
  }, [navigate]);

  const totalSpent = expenditure?.expenditures.reduce(
    (sum, exp) => sum + (exp.amountSpent || 0),
    0
  );
  const remainingAmount = (expenditure?.totalAmount || 0) - totalSpent;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, width: "100%" }}>
      {loading ? (
        <SquareLoader />
      ) : expenditure ? (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              {expenditure.eventName || "Event Name Not Available"}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setPopupOpen(true)}
              sx={{
                borderColor: "#B0BEC5",
                color: "#455A64",
                "&:hover": {
                  borderColor: "#78909C",
                  backgroundColor: "#ECEFF1",
                },
              }}
            >
              Add Expense
            </Button>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mt: 3,
            }}
          >
            {/* ✅ Summary Block */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: { xs: "100%", md: "500px" },
                bgcolor: "#F5F5F5",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Expenditure Summary
              </Typography>
              <Divider />
              <Box mt={2}>
                <Typography variant="subtitle1">Total Budget: ₹{expenditure.totalAmount}</Typography>
                <Typography variant="subtitle1" sx={{ color: "green" }}>
                  Total Spent: ₹{totalSpent}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: remainingAmount < 0 ? "red" : "orange" }}
                >
                  Remaining: ₹{remainingAmount}
                </Typography>
              </Box>
            </Paper>

            {/* ✅ Expenditure Details with Receipt */}
            <Box sx={{ flex: 1 }}>
              {expenditure.expenditures && expenditure.expenditures.length > 0 ? (
                expenditure.expenditures.map((exp, index) => (
                  <Card
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      mb: 3,
                      bgcolor: "#FAFAFA",
                      boxShadow: 1,
                      borderRadius: 2,
                      gap: 2,
                    }}
                  >
                    {exp.receiptImageUrl && (
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: "100%", md: 300 },
                          height: 250,
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        image={exp.receiptImageUrl}
                        alt="Receipt"
                        onClick={() => setSelectedImage(exp.receiptImageUrl)}
                      />
                    )}
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                        ₹{exp.amountSpent || 0} - {exp.description || "No Description"}
                      </Typography>

                      <Box display="flex" alignItems="center" mt={1}>
                        <PersonOutlineIcon fontSize="small" sx={{ color: "#90A4AE" }} />
                        <Typography variant="caption" color="text.secondary" ml={0.5}>
                          Updated by: {exp.updatedBy || "Unknown"}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mt={1}>
                        <CalendarMonthIcon fontSize="small" sx={{ color: "#90A4AE" }} />
                        <Typography variant="caption" color="text.secondary" ml={0.5}>
                          {new Date(exp.dateOfUpdate).toLocaleDateString("en-GB")}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" mt={4}>
                  No expenditure details yet.
                </Typography>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Typography color="error" mt={4}>
          No expenditure details found for this event.
        </Typography>
      )}

      {/* ✅ Add Expense Modal */}
      <Modal open={isPopupOpen} onClose={() => setPopupOpen(false)}>
        <Box sx={modalStyle}>
          {user && (
            <AddExpenditureForm
              closePopup={() => setPopupOpen(false)}
              expenditureId={id}
            />
          )}
        </Box>
      </Modal>

      {/* ✅ Receipt Fullscreen Modal */}
      <Modal open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Receipt Full View"
              style={{ width: "100%", height: "auto", borderRadius: "5px" }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ExpenditureDetails;
