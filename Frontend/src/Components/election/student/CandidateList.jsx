import React, { useState, useEffect } from 'react';
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import CandidateCard from '../common/CandidateCard';

// Styled Container (Centered & Responsive)
const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px',
  width: '100%',
});

// Loading Box (Centered Spinner)
const LoaderBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
});

// Candidate Wrapper (Ensures equal height & responsiveness)
const CandidatesWrapper = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '24px',
  width: '100%',
});

// Styled Card Wrapper (Ensures Equal Height)
const CardWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch', // Makes all cards equal height
  minHeight: '400px', // Ensures uniform card height
  flex: '1 1 300px', // Ensures responsiveness
  maxWidth: '320px',
});

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
    checkVoteStatus();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/election/candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/election/vote-status', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setHasVoted(data.hasVoted);
    } catch (err) {
      setError('Failed to check vote status');
    }
  };

  const handleVote = async (candidateId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/election/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ candidateId }),
      });

      if (response.ok) {
        setHasVoted(true);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  return (
    <StyledContainer>
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoaderBox>
          <CircularProgress size={60} thickness={4} />
        </LoaderBox>
      ) : (
        <CandidatesWrapper>
          {candidates.map((candidate) => (
            <CardWrapper key={candidate._id}>
              <CandidateCard
                candidate={candidate}
                onVote={handleVote}
                hasVoted={hasVoted}
              />
            </CardWrapper>
          ))}
        </CandidatesWrapper>
      )}
    </StyledContainer>
  );
};

export default CandidateList;
