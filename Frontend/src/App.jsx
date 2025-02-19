import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import LoginSignupPage from "./Pages/LoginSignupPage.jsx/LoginSignupPage";
// import About from './Pages/About/About'; // Example of a public page
// import Profile from './Pages/Profile/Profile'; // Example of a protected page
import ProtectedRoute from "../src/utils/ProtectedRoute"; // Import the ProtectedRoute component
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import StudentHome from "./Pages/StudentHome/StudentHome";
import AdminHome from "./Pages/AdminHome/AdminHome";
import DoctorHome from "./Pages/DoctorHome/DoctorHome";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginSignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["student", "doctor", "admin"]}>
              <Home /> {/* Only accessible if the user is authenticated */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentHome /> {/* Only accessible if the user is authenticated */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHome /> {/* Only accessible if the user is authenticated */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["doctor", "admin"]}>
              <DoctorHome /> {/* Only accessible if the user is authenticated */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />{" "}
              {/* Only accessible if the user is authenticated */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
