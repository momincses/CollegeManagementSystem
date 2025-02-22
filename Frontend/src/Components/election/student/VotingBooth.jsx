import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CandidateCard from '../common/CandidateCard';
import SquareLoader from '../../../Components/Loader/SquareLoader/SquareLoader'

const steps = ['Review Candidates', 'Select Candidate', 'Confirm Vote'];

const VotingBooth = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  useEffect(() => {
    checkVoteStatus();
    fetchCandidates();
  }, []);

  const checkVoteStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/election/vote-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.hasVoted) {
        setHasVoted(true);
        navigate('/student/election/results');
      }
    } catch (err) {
      setError('Failed to check voting status');
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/election/candidates');
      const data = await response.json();
      setCandidates(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch candidates');
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedCandidate) {
      setError('Please select a candidate before proceeding');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
    if (activeStep === 1) {
      setConfirmDialog(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setError(null);
  };

  const handleVoteSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/election/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          candidateId: selectedCandidate._id
        })
      });

      if (response.ok) {
        setVoteSuccess(true);
        setHasVoted(true);
        setConfirmDialog(false);
        setTimeout(() => {
          navigate('/election/results');
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  if (loading) {
    return (
      <SquareLoader/>
    );
  }

  if (hasVoted) {
    return (
      <Container>
        <Alert severity="info">
          You have already cast your vote. Redirecting to results...
        </Alert>
      </Container>
    );
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Please review all candidates before proceeding
            </Typography>
            <Grid container spacing={3}>
              {candidates.map((candidate) => (
                <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                  <CandidateCard
                    candidate={candidate}
                    isPreview={true}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        );
      
      case 1:
        return (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select your candidate
            </Typography>
            <Grid container spacing={3}>
              {candidates.map((candidate) => (
                <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                  <CandidateCard
                    candidate={candidate}
                    selected={selectedCandidate?._id === candidate._id}
                    onSelect={() => handleCandidateSelect(candidate)}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        );
      
      case 2:
        return (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review your selection
            </Typography>
            {selectedCandidate && (
              <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                <CandidateCard
                  candidate={selectedCandidate}
                  isPreview={true}
                />
              </Box>
            )}
          </Paper>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Voting Booth
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {voteSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your vote has been successfully recorded! Redirecting to results...
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 1 && !selectedCandidate}
          >
            {activeStep === steps.length - 1 ? 'Submit Vote' : 'Next'}
          </Button>
        </Box>

        <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
          <DialogTitle>Confirm Your Vote</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to vote for {selectedCandidate?.name}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button onClick={handleVoteSubmit} variant="contained" color="primary">
              Confirm Vote
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default VotingBooth; 