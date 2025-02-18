import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SquareLoader from "../../Components/Loader/SquareLoader/SquareLoader"
const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded); // Set user details from token
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return <SquareLoader></SquareLoader>;

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {user.email || "User"}!</p>

      <p>Your Role: {user.role}</p>
      <p>Your Id: {user.id}</p>

      {user.role === "admin" ? (
        <p>You have admin access!</p>
      ) : (
        <p>You are a regular user.</p>
      )}
    </div>
  );
};

export default Home;
