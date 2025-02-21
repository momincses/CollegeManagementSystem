import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../Components/StudentPageComponents/Navbar/Navbar";
import StudentHome from "../Pages/StudentHome/StudentHome";
import ElectionRoutes from "./ElectionRoutes";
import EventRequestForm from '../Components/events/EventRequestForm';
import ProtectedRoute from "../utils/ProtectedRoute";
import EventsList from '../Components/events/EventsList';

const StudentRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Route with Navbar */}
      <Route path="/" element={<Navbar><Outlet /></Navbar>}>
        {/* Dashboard - Only for students and admins */}
        <Route index element={
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <StudentHome />
          </ProtectedRoute>
        } />

        {/* Election System Routes */}
        <Route path="election/*" element={<ElectionRoutes />} />

        {/* Event System Routes */}
        {/* View Events - Accessible to all roles */}
        <Route path="events" element={
          <ProtectedRoute allowedRoles={["student", "student-coordinator", "admin"]}>
            <EventsList />
          </ProtectedRoute>
        } />
        
        {/* Create Event Request - Only for student coordinators */}
        <Route path="event-request" element={
          <ProtectedRoute allowedRoles={["student-coordinator"]}>
            <EventRequestForm />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
