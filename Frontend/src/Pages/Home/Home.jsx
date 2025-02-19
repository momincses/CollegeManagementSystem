import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import SquareLoader from "../../Components/Loader/SquareLoader/SquareLoader";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);

      if (decoded.role === "student") navigate("/student");
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, [navigate]);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 1000); // Simulate loader for 1 second
  };

  if (!user || loading) return <SquareLoader />;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: 400, padding: 3, textAlign: "center", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Welcome, {user.email || "User"}!
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Role: <strong>{user.role}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User ID: {user.id}
          </Typography>

          <Box display="flex" flexDirection="column" gap={1.5}>
            {user.role === "doctor" && (
              <Button
                onClick={() => handleNavigation("/doctor")}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2 }}
              >
                Go to Doctor Page
              </Button>
            )}
            {user.role === "admin" && (
              <>
                <Button
                  onClick={() => handleNavigation("/admin")}
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Go to Admin Page
                </Button>
                <Button
                  onClick={() => handleNavigation("/doctor")}
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Go to Doctor Page
                </Button>
                <Button
                  onClick={() => handleNavigation("/student")}
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Go to Students Page
                </Button>
              </>
            )}
            <Button
              onClick={() => handleNavigation("/")}
              variant="outlined"
              color="primary"
              sx={{ borderRadius: 2 }}
            >
              Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
