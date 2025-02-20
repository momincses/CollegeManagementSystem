import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import CandidateList from "../Components/election/student/CandidateList";
import VotingBooth from '../components/election/student/VotingBooth';
import ElectionDashboard from '../components/election/admin/ElectionDashboard';
import ResultsDisplay from '../components/election/common/ResultsDisplay';
import ProtectedRoute from '../utils/ProtectedRoute';



const ElectionRoutes = () => {
  return (
    <>
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