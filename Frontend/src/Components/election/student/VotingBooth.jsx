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
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CandidateCard from '../common/CandidateCard';
import SquareLoader from '../../Loader/SquareLoader/SquareLoader'

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
  const [step, setStep] = useState(1); // 1: Review, 2: Select, 3: Confirm
  const [showVotedDialog, setShowVotedDialog] = useState(false);

  const checkIfVoted = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/election/Vote-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.hasVoted) {
        setShowVotedDialog(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking vote status:', err);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const votingStatus = await checkIfVoted();
      if (!votingStatus) {
        fetchCandidates();
      }
    };
    init();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/election/candidates', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCandidates(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch candidates');
      setLoading(false);
    }
  };

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setStep(3); // Move to confirmation step
  };

  const handleConfirmVote = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/election/Vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          candidateId: selectedCandidate._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Voting failed');
      }

      alert('Vote submitted successfully!');
      navigate('/student/election/results');
    } catch (err) {
      setError('Failed to submit vote: ' + err.message);
      console.error('Voting error:', err);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    if (step === 3) {
      setSelectedCandidate(null);
    }
  };

  const handleViewResults = () => {
    navigate('/student/election/results');
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

  const renderStep = () => {
    switch (step) {
      case 1: // Review Step
        return (
          <>
            <Typography variant="h4" gutterBottom>
              Review Candidates
            </Typography>
            <Grid container spacing={3}>
              {candidates.map((candidate) => (
                <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={candidate.photoUrl}
                      alt={candidate.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{candidate.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Position: {candidate.position}
                      </Typography>
                      <Typography variant="body2">
                        {candidate.manifesto}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setStep(2)}
              >
                Proceed to Vote
              </Button>
            </Box>
          </>
        );

      case 2: // Select Step
        return (
          <>
            <Typography variant="h4" gutterBottom>
              Select Your Candidate
            </Typography>
            <Grid container spacing={3}>
              {candidates.map((candidate) => (
                <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={candidate.photoUrl}
                      alt={candidate.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{candidate.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Position: {candidate.position}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelectCandidate(candidate)}
                      >
                        Select Candidate
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleBack}>Back</Button>
            </Box>
          </>
        );

      case 3: // Confirm Step
        return (
          <>
            <Typography variant="h4" gutterBottom>
              Confirm Your Vote
            </Typography>
            {selectedCandidate && (
              <Box sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={selectedCandidate.photoUrl}
                    alt={selectedCandidate.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{selectedCandidate.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Position: {selectedCandidate.position}
                    </Typography>
                  </CardContent>
                </Card>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack}>Back</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmVote}
                  >
                    Confirm Vote
                  </Button>
                </Box>
              </Box>
            )}
          </>
        );

      default:
        return null;
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

        <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStep()}

        <Dialog
          open={showVotedDialog}
          onClose={() => setShowVotedDialog(false)}
        >
          <DialogTitle>Already Voted</DialogTitle>
          <DialogContent>
            <Typography>
              You have already cast your vote in this election.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleViewResults}
            >
              View Results
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default VotingBooth; 