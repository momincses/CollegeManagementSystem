import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/system';
import {jwtDecode} from 'jwt-decode';

import CandidateList from "../Components/election/student/CandidateList";
import VotingBooth from '../Components/election/student/VotingBooth';
import ElectionDashboard from '../Components/election/admin/ElectionDashboard';
import ResultsDisplay from '../Components/election/common/ResultsDisplay';
import ProtectedRoute from '../utils/ProtectedRoute';

// 🌿 Professional Button Style
const StyledButton = styled(Button)(({ theme }) => ({
  padding: '8px 22px',
  borderRadius: '20px',
  backgroundColor: '#F5F5F5',
  color: '#333',
  fontWeight: '500',
  fontSize: '15px',
  textTransform: 'none',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#E0E0E0',
    transform: 'translateY(-2px)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

// 🖋️ Seamless Navbar Wrapper
const NavWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '15px 0',
  backgroundColor: '#FFFFFF',
  position: 'sticky',
  top: 0,
  zIndex: 10,
});

const ElectionRoutes = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken?.role || null);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems:"flex-start", width: '100%' }}>
      {/* 🎨 Professional Navigation Bar */}
      <NavWrapper>
        <Stack direction="row" spacing={2}>
          <Link to="/student/election/candidates">
            <StyledButton>View Candidates</StyledButton>
          </Link>
          <Link to="/student/election/vote">
            <StyledButton>Vote Now</StyledButton>
          </Link>
          <Link to="/student/election/results">
            <StyledButton>View Results</StyledButton>
          </Link>
          {userRole === 'admin' && (
            <Link to="/student/election/dashboard">
              <StyledButton
                sx={{
                  backgroundColor: '#1565C0',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#0D47A1',
                  },
                }}
              >
                Admin Dashboard
              </StyledButton>
            </Link>
          )}
        </Stack>
      </NavWrapper>

      {/* 📜 Routes Section */}
      <Routes>
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
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ElectionDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="candidates" replace />} />
      </Routes>
    </Box>
  );
};

export default ElectionRoutes;
