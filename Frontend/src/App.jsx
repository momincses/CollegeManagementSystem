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
import { AuthProvider } from "./contexts/AuthContext";
import UnauthorizedPage from "./components/common/UnauthorizedPage";
import StudentRoutes from "./routes/StudentRoutes";

// Remove or comment out these imports until you create the components
// import Navbar from './components/common/Navbar';
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginSignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["student", "doctor", "admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/election/*"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <ElectionRoutes />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <StudentRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <StudentHome />{" "}
                {/* Only accessible if the user is authenticated */}
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminHome />{" "}
                {/* Only accessible if the user is authenticated */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["doctor", "admin"]}>
                <DoctorHome />{" "}
                {/* Only accessible if the user is authenticated */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />{" "}
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
