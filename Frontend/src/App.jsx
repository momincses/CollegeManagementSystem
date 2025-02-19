import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Pages/Home/Home';
import LoginSignupPage from './Pages/LoginSignupPage.jsx/LoginSignupPage';
import ProtectedRoute from './utils/ProtectedRoute';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import ElectionRoutes from './routes/ElectionRoutes';
import UnauthorizedPage from './components/common/UnauthorizedPage';

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
          <Route path="/election/*" element={<ElectionRoutes />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
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
