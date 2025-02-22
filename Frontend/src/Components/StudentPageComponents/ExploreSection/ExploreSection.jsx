import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const exploreItems = [
  { label: "Elections", path: "/student/election/candidates" },
  { label: "Sick Leave", path: "/student/sick-leave" },
  { label: "Facility Booking", path: "/student/facility-booking" },
  { label: "Event Requests", path: "/student/events" },
  { label: "Complaints", path: "/student/complaints" },
  { label: "Budget Tracker", path: "/student/budget-tracking" },
  { label: "Cheater Records", path: "/student/budget-tracking" },
  { label: "My Complaints", path: "/student/my-complaints" },
  { label: "Register Complaint", path: "/student/register-complaint" },
  { label: "Public Complaints", path: "/student/public-complaints" },
  { label: "Logout", path: "/student/logout" },
];

const ExploreSection = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2 },
        bgcolor: "#f9f9f9",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
        Explore Campus Services
      </Typography>

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          pb: 1,
          boxSizing: 'border-box',
          minWidth: "200px",
          maxWidth: "100vw",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar
          msOverflowStyle: "none", // Hide scrollbar in IE and Edge
          scrollbarWidth: "none", // Hide scrollbar in Firefox
        }}
      >
        {exploreItems.map((item) => (
          <Button
            key={item.label}
            variant="contained"
            component={Link}
            to={item.path}
            sx={{
              borderRadius: "20px",
              minWidth: { xs: "140px", sm: "160px", md: "180px" }, // Responsive width
              bgcolor: "#e3f2fd",
              color: "#1e88e5",
              textTransform: "none",
              fontWeight: 500,
              px: 2,
              py: 1,
              flexShrink: 0, // Prevent shrinking to ensure horizontal scroll
              transition: "all 0.3s",
              "&:hover": {
                bgcolor: "#bbdefb",
                color: "#1565c0",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ExploreSection;
