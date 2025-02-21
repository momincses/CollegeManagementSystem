import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const StudentHero = () => {
  const greeting = getGreeting();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        boxSizing: "border-box",
        height: "auto",
        minHeight: "15vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)", // Correct background usage
        borderRadius: 4,
        mb: 3,
        padding: '15px',
        overflow: "hidden",
        width: "100%", // Ensures it takes width of parent, not viewport
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ fontWeight: "bold", color: "#1565c0" }}
      >
        {greeting}, Student!
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: "#616161" }}>
        What would you like to do today?
      </Typography>
    </Box>
  );
};

export default StudentHero;
