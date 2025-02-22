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
    boxSizing:'border-box',
    p: "20px",
    height: "auto",
    minHeight: "25vh",
    bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)", // Light gradient
    borderRadius: 4,
    boxShadow: 4,
    mb: 3,
    overflow: "hidden",
    width: "96%",
    border: "1px solid #e0e0e0",
  }}
>
  <Typography
    variant={isMobile ? "h5" : "h4"}
    sx={{ fontWeight: "bold", color: "#1565c0" }} // Softer primary color
  >
    {greeting}, Board Member!
  </Typography>
  <Typography variant="body1" sx={{ mt: 1, color: "#616161" }}>
    What would you like to do today?
  </Typography>
</Box>
  );
};

export default StudentHero;
