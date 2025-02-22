import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "../Components/StudentPageComponents/Navbar/Navbar";
import StudentHome from "../Pages/StudentHome/StudentHome";
import ElectionRoutes from "./ElectionRoutes";
import EventRequestForm from "../Components/events/EventRequestForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import EventsList from "../Components/events/EventsList";
import StudentSickLeave from "../Components/SickLeave/Student/StudentSickLeave";
import FacilityBookingPage from "../Components/FacilityBooking/FacilityBookingPage";
import FacilityDetails from "../Components/FacilityBooking/FacilityDetails";
// import Logout from "../Components/AdminPageComponents/BoardMemberRoutes/Logout";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<StudentHome />} />
        <Route path="/election/*" element={<ElectionRoutes />} />
        <Route path="/sick-leave" element={<StudentSickLeave />} />
        <Route path="/facility-booking" element={<FacilityBookingPage />} />
        <Route path="/facility/:facilityId" element={<FacilityDetails />} />
        {/* <Route path="/track-booking" element={<TrackBooking />} /> */}
        {/* 🔥 Add more routes here as needed */}
        {/* Complaints System */}
        {/* <Route path="/my-complaints" element={<MyComplaints />} />
        <Route
          path="/register-complaint"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <RegisterComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/public-complaints"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PublicComplaints />
            </ProtectedRoute>
          }
        /> */}

        {/* Event System Routes */}
        {/* View Events - Accessible to all roles */}
        <Route
          path="/events"
          element={
            <ProtectedRoute
              allowedRoles={["student", "student-coordinator", "admin"]}
            >
              <EventsList />
            </ProtectedRoute>
          }
        />

        {/* Create Event Request - Only for student coordinators */}
        <Route
          path="/student-coordinator/event-request"
          element={
            // <ProtectedRoute >
            <EventRequestForm />
            // </ProtectedRoute>
          }
        />
        {/* <Route path="/logout" element={<Logout />} /> */}
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
