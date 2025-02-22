import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../Components/StudentPageComponents/Navbar/Navbar";
import StudentHome from "../Pages/StudentHome/StudentHome";
import ElectionRoutes from "./ElectionRoutes";
import EventRequestForm from '../Components/events/EventRequestForm';
import ProtectedRoute from "../utils/ProtectedRoute";
import EventsList from '../Components/events/EventsList';
import StudentSickLeave from "../Components/SickLeave/Student/StudentSickLeave";
import MyComplaints from "../Components/AdminPageComponents/BoardMemberRoutes/MyComplaints";
import RegisterComplaint from "../Components/AdminPageComponents/BoardMemberRoutes/RegisterComplaint";
import PublicComplaints from "../Components/AdminPageComponents/BoardMemberRoutes/PublicComplaints";
import Logout from "../Components/AdminPageComponents/BoardMemberRoutes/Logout";

const StudentRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Route with Navbar */}
      <Route path="/" element={<Navbar><Outlet /></Navbar>}>
        
        {/* Dashboard - Accessible to Students */}
        <Route index element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentHome />
          </ProtectedRoute>
        } />

        {/* Election System */}
        <Route path="/election/*" element={<ElectionRoutes />} />

        {/* Sick Leave Management */}
        <Route path="/sick-leave" element={<StudentSickLeave />} />

        {/* Complaints System */}
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/register-complaint" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <RegisterComplaint />
          </ProtectedRoute>
        } />
        <Route path="/public-complaints" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <PublicComplaints />
          </ProtectedRoute>
        } />

        {/* Event System */}
        <Route path="/events" element={
          <ProtectedRoute allowedRoles={["student", "student-coordinator", "admin"]}>
            <EventsList />
          </ProtectedRoute>
        } />
        <Route path="/student-coordinator/event-request" element={
          <ProtectedRoute allowedRoles={["student-coordinator"]}>
            <EventRequestForm />
          </ProtectedRoute>
        } />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
