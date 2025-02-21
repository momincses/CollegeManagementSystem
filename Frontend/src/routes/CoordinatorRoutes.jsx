import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminInvitePage from "../Components/admin/InviteLinkGenerator/AdminInvitePage";
import SignupPage from "../Components/Coordinators/CoordinatorSignup";
import LoginPage from "../Components/Coordinators/CordinatorLogin";
import ProtectedRoute from "../utils/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/admin-invite"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminInvitePage />
          </ProtectedRoute>
        }
      />
      <Route path="/signup/:token" element={<SignupPage />} />
      <Route path="/:role/login" element={<LoginPage />} />
      {/* <Route path="/:role/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default App;
