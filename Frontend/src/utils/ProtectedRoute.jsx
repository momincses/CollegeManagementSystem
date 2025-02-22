import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SquareLoader from "../Components/Loader/SquareLoader/SquareLoader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      setIsAuthorized(false);
      return;
    }

    try {
      const user = jwtDecode(token);

      // 🎯 Role check
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("authToken");
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [allowedRoles]);

  // ⏳ Show loader while checking authorization
  if (loading) return <SquareLoader />;

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;



