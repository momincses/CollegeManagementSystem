import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SquareLoader from "../Loader/SquareLoader/SquareLoader";

const BASE_URL = "http://localhost:5000";

const AllExpenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenditures = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/expenditures`);
        setExpenditures(Array.isArray(data.expenditures) ? data.expenditures : []);
      } catch (error) {
        console.error("Error fetching expenditures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenditures();
  }, []);

  if (loading) return <SquareLoader />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f9f9f9", width: "100%" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ color: "#333", fontWeight: "bold" }}>
          💰 All Expenditures
        </Typography>
      </Box>

      {/* Expenditures Grid */}
      {expenditures.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#9e9e9e",
            fontWeight: "500",
            mt: 5,
          }}
        >
          🚫 No budget to track.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {expenditures.map((exp) => (
            <Grid item xs={12} sm={6} md={4} key={exp._id}>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  borderRadius: "16px",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#333", fontWeight: "600" }}>
                    {exp.eventName || "Unnamed Event"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", mt: 1 }}
                  >
                    {(exp.eventDescription || "No description available").substring(
                      0,
                      100
                    )}
                    ...
                  </Typography>
                  <Typography
                    sx={{
                      color: "#1abc9c",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      mt: 2,
                    }}
                  >
                    Total: ₹{exp.totalAmount ?? "0"}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 2,
                      borderRadius: "20px",
                      textTransform: "none",
                    }}
                    onClick={() => navigate(`/student/expenditure/${exp._id}`)}
                  >
                    View Expenses
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllExpenditures;
