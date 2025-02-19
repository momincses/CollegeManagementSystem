import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // You'll need to create this

// Import components
import CandidateList from '../components/election/student/CandidateList';
import VotingBooth from '../components/election/student/VotingBooth';
import ElectionDashboard from '../components/election/admin/ElectionDashboard';
import ResultsDisplay from '../components/election/common/ResultsDisplay';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const ElectionRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="candidates" element={<CandidateList />} />
      <Route path="results" element={<ResultsDisplay />} />

      {/* Student Routes */}
      <Route
        path="vote"
        element={
          <ProtectedRoute roles={['student']}>
            <VotingBooth />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <ElectionDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/election/candidates" replace />} />
    </Routes>
  );
};

export default ElectionRoutes; 