import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Alert } from '@mui/material';
import CandidateCard from '../common/CandidateCard';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);

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
    }
  };

  const checkVoteStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/election/vote-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ candidateId })
      });

      if (response.ok) {
        setHasVoted(true);
        // Trigger socket event for real-time updates
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>
        Current Candidates
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {candidates.map((candidate) => (
          <Grid item xs={12} sm={6} md={4} key={candidate._id}>
            <CandidateCard
              candidate={candidate}
              onVote={handleVote}
              hasVoted={hasVoted}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CandidateList;