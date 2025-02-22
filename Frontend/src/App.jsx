import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home/Home";
import LoginSignupPage from "./Pages/LoginSignupPage.jsx/LoginSignupPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import StudentHome from "./Pages/StudentHome/StudentHome";
import AdminHome from "./Pages/AdminHome/AdminHome";
import DoctorHome from "./Pages/DoctorHome/DoctorHome";
import BoardMemberRoutes from "./routes/BoardMembersRoutes";
import CoordinatorRoutes from "./routes/CoordinatorRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import UnauthorizedPage from "./components/common/UnauthorizedPage";
import StudentRoutes from "./routes/StudentRoutes";
import CoordinatorRoutes from "./routes/CoordinatorRoutes";
import AdminFacilityPanel from "./Components/FacilityBooking/AdminFacilityPanel";

// Remove or comment out these imports until you create the components
// import Navbar from './components/common/Navbar';
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginSignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Home Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["student", "doctor", "admin", "board-member"]}>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentHome />
              </ProtectedRoute>
            }
          />

          {/* Coordinator Routes */}
          <Route
            path="/coordinator/*"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <CoordinatorRoutes />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/facilities-panel" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminFacilityPanel />
          </ProtectedRoute>
        } />

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["doctor", "admin"]}>
                <DoctorHome />
              </ProtectedRoute>
            }
          />

          {/* Board Member Routes */}
          <Route
            path="/board-member"
            element={
              <ProtectedRoute allowedRoles={["board-member"]}>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board-member/*"
            element={
              <ProtectedRoute allowedRoles={["board-member"]}>
                <BoardMemberRoutes />
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
