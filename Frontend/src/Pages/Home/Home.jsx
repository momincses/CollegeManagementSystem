import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SquareLoader from "../../Components/Loader/SquareLoader/SquareLoader"

const Home = () => {
  const [user, setUser] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Test API connection
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => {
        setApiStatus(data);
        console.log("API Status:", data);
      })
      .catch(err => {
        console.error("API Connection Error:", err);
        setApiStatus({ status: "error", message: err.message });
      });

    // Check authentication
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return <SquareLoader />;

  return (
    <div>
      <h1>System Status</h1>
      
      <h2>User Information:</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>ID: {user.id}</p>

      <h2>API Status:</h2>
      {apiStatus ? (
        <div>
          <p>Status: {apiStatus.status}</p>
          <p>Message: {apiStatus.message}</p>
          <p>Database: {apiStatus.database}</p>
          <p>Auth Service: {apiStatus.auth}</p>
        </div>
      ) : (
        <p>Loading API status...</p>
      )}
    </div>
  );
};

export default Home;
