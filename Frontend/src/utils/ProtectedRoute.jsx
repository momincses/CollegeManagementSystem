import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // You can replace this with your actual authentication logic (e.g., Firebase, etc.)

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return children; // Render the children (i.e., the Home page) if authenticated
};

export default ProtectedRoute;
