import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import ElectionRoutes from "./ElectionRoutes";
import ProtectedRoute from "../utils/ProtectedRoute";
import EventsList from "../Components/events/EventsList";
import StudentSickLeave from "../Components/SickLeave/Student/StudentSickLeave";
import FacilityBookingPage from "../Components/FacilityBooking/FacilityBookingPage";
import FacilityDetails from "../Components/FacilityBooking/FacilityDetails";
// import Logout from "../Components/AdminPageComponents/BoardMemberRoutes/Logout";
import PublicComplaints from "../Components/AdminPageComponents/BoardMemberRoutes/PublicComplaints";
import Logout from "../Components/AdminPageComponents/BoardMemberRoutes/Logout";
import BudgetTracking from "../Components/BudgetTracking";
import AdminHome from "../Pages/AdminHome/AdminHome";
import AdminNavbar from "../Pages/AdminHome/AdminNavbar"
import ElectionDashboard from "../Components/election/admin/ElectionDashboard";
import CandidateList from "../Components/election/student/CandidateList";
import AdminFacilityPanel from "../Components/FacilityBooking/AdminFacilityPanel"
import EventManagement from "../Components/admin/EventManagement";
import AllExpenditures from "../Components/BudgetTracking/AllExpenditures";
import ExpenditureDetails from "../Components/BudgetTracking/ExpenditureDetails";
import AdminInvitePage from "../Components/admin/InviteLinkGenerator/AdminInvitePage"
const StudentRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Route with Navbar */}
      <Route path="/" element={<AdminNavbar/>}>
        

        <Route path="/" element={<AdminHome />} />

        <Route path="/election/dashboard" element={<ElectionDashboard />} />
        <Route path="/election/candidates" element={<CandidateList />} />

        <Route path="/sick-leave" element={<StudentSickLeave />} />
        <Route path="/facility-booking" element={<FacilityBookingPage />} />
        <Route path="/facility/:facilityId" element={<FacilityDetails />} />
        <Route path="/facility-dashboard" element={<AdminFacilityPanel />} />
        <Route path="/facility/:facilityId" element={<FacilityDetails />} />
        {/* <Route path="/facility/:facilityId" element={<FacilityDetails />} /> */}

        <Route
        path="/invite"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminInvitePage />
          </ProtectedRoute>
        }
      />
    
        <Route
          path="/public-complaints"
          element={
            <ProtectedRoute >
              <PublicComplaints />
            </ProtectedRoute>
          }
        />


        <Route
          path="/events/all"
          element={
            <ProtectedRoute
              allowedRoles={["student", "student-coordinator", "admin"]}
            >
              <EventsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["student", "student-coordinator", "admin"]}
            >
              <EventManagement />
            </ProtectedRoute>
          }
        />

    
        {/* <Route path="/logout" element={<Logout />} /> */}

        <Route path="/allfacilities" element={<FacilityBookingPage />} />
        <Route path="/facility/:id" element={<FacilityDetails />} />
        
        <Route
            path="/expenditure/list"
            element={
              <ProtectedRoute>
                <AllExpenditures />
              </ProtectedRoute>
            }
          />
        <Route
            path="/expenditure/:id"
            element={
              <ProtectedRoute>
                <ExpenditureDetails />
              </ProtectedRoute>
            }
          />

        
      <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

    </Routes>
  );
};

export default StudentRoutes;
