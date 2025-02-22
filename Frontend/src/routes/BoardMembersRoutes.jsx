import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../Components/AdminPageComponents/Navbar/Navbar";
import BoardMemberHome from "../Pages/AdminHome/AdminHome";
// import ElectionRoutes from "./ElectionRoutes";
// import EventRequestForm from '../Components/events/EventRequestForm';
import Logout from "../Components/AdminPageComponents/BoardMemberRoutes/Logout";
import ProtectedRoute from "../utils/ProtectedRoute";
// import EventsList from '../Components/events/EventsList';
import MyComplaints from "../Components/AdminPageComponents/BoardMemberRoutes/MyComplaints";
import FlaggedComplaints from "../Components/AdminPageComponents/BoardMemberRoutes/FlaggedComplaints";
import PublicComplaints from "../Components/AdminPageComponents/BoardMemberRoutes/PublicComplaints";


const BoardMemberRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Route with Navbar */}
      <Route path="/" element={<Navbar><Outlet /></Navbar>}>
        {/* Dashboard - Only for students and admins */}
        <Route index element={
          <ProtectedRoute allowedRoles={["board-member"]}>
            <BoardMemberHome />
          </ProtectedRoute>
        } />

        {/* Registering any complaint */}
        <Route path="/flagged-complaints" element={
          <ProtectedRoute allowedRoles={["board-member"]}>
            <FlaggedComplaints />
          </ProtectedRoute>
        } />

        {/* Public Complaints */}
        <Route path="/public-complaints" element={
          <ProtectedRoute allowedRoles={["board-member"]}>
            <PublicComplaints />
          </ProtectedRoute>
        } />

        {/* logout event */}
        <Route path="/logout" element={
          <ProtectedRoute allowedRoles={["board-member"]}>
            {/* <EventRequestForm /> */}
            <Logout />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default BoardMemberRoutes;
