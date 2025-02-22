import React, { useMemo } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "start",
  boxSizing: "border-box",
  minHeight: "15vh",
  background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
  borderRadius: 4,
  mb: 3,
  padding: "15px",
  overflow: "hidden",
  width: "100%",
};

const titleStyle = { fontWeight: "bold", color: "#1565c0" };
const bodyTextStyle = { mt: 1, color: "#616161" };

// const getGreeting = () => {
//   const hour = new Date().getHours();
//   if (hour < 12) return "Good Morning";
//   if (hour < 18) return "Good Afternoon";
//   return "Good Evening";
// };

const StudentHero = React.memo(() => {
  // const greeting = useMemo(() => getGreeting(), []);
  const isMobile = useMediaQuery("(max-width:600px)", { defaultMatches: false });

  return (
    <Box sx={boxStyle}>
      <Typography variant={isMobile ? "h5" : "h4"} sx={titleStyle}>
        Hello, Student!
      </Typography>
      <Typography variant="body1" sx={bodyTextStyle}>
        What would you like to do today?
      </Typography>
    </Box>
  );
});

export default StudentHero;
