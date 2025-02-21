import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

import CandidateList from "../Components/election/student/CandidateList";
import VotingBooth from '../Components/election/student/VotingBooth';
import ElectionDashboard from '../Components/election/admin/ElectionDashboard';
import ResultsDisplay from '../Components/election/common/ResultsDisplay';
import ProtectedRoute from '../utils/ProtectedRoute';

const NavigationButtons = ({ userRole }) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3, mt: 2 }}>
      <Button component={Link} to="/student/election/candidates" variant="contained" color="primary">
        View Candidates
      </Button>
      <Button component={Link} to="/student/election/vote" variant="contained" color="primary">
        Vote Now
      </Button>
      <Button component={Link} to="/student/election/results" variant="contained" color="primary">
        View Results
      </Button>
      {userRole === 'admin' && (
        <Button component={Link} to="/student/election/dashboard" variant="contained" color="secondary">
          Admin Dashboard
        </Button>
      )}
    </Stack>
  );
};

const ElectionRoutes = () => {
  // You'll need to get the actual user role from your auth context
  const userRole = 'admin'; // This should come from your auth context

  return (
    <>
      <NavigationButtons userRole={userRole} />
      <Routes>
        {/* Student Routes */}
        <Route
          path="vote"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <VotingBooth />
            </ProtectedRoute>
          }
        />
        <Route
          path="candidates"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <CandidateList />
            </ProtectedRoute>
          }
        />
        <Route
          path="results"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <ResultsDisplay />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ElectionDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/election/candidates" replace />} />
      </Routes>
    </>
  );
};

export default ElectionRoutes; 