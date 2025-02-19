import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  IconButton,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import CandidateForm from './CandidateForm';
import ResultsDisplay from '../common/ResultsDisplay';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ElectionDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [electionStats, setElectionStats] = useState({
    totalVotes: 0,
    totalCandidates: 0,
    activeVoters: 0
  });

  useEffect(() => {
    fetchCandidates();
    fetchElectionStats();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/election/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCandidates(data);
    } catch (err) {
      setError('Failed to fetch candidates');
    }
  };

  const fetchElectionStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/election/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setElectionStats(data);
    } catch (err) {
      setError('Failed to fetch election statistics');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/election/candidate/${candidateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setSuccess('Candidate deleted successfully');
          fetchCandidates();
        } else {
          setError('Failed to delete candidate');
        }
      } catch (err) {
        setError('Failed to delete candidate');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    fetchCandidates();
    fetchElectionStats();
    setSuccess('Data refreshed successfully');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Election Dashboard
          <IconButton onClick={handleRefresh} sx={{ ml: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Votes Cast
                </Typography>
                <Typography variant="h4">
                  {electionStats.totalVotes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Candidates
                </Typography>
                <Typography variant="h4">
                  {electionStats.totalCandidates}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Voters
                </Typography>
                <Typography variant="h4">
                  {electionStats.activeVoters}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Candidates" />
              <Tab label="Results" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
              sx={{ mb: 3 }}
            >
              Add New Candidate
            </Button>

            <Grid container spacing={3}>
              {candidates.map((candidate) => (
                <Grid item xs={12} sm={6} md={4} key={candidate._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{candidate.name}</Typography>
                      <Typography color="textSecondary">
                        Position: {candidate.position}
                      </Typography>
                      <Typography variant="body2">
                        Votes: {candidate.votes}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton 
                        onClick={() => handleDeleteCandidate(candidate._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ResultsDisplay />
          </TabPanel>
        </Paper>

        <Dialog 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <CandidateForm 
            onSuccess={() => {
              setIsFormOpen(false);
              fetchCandidates();
              setSuccess('Candidate added successfully');
            }}
          />
        </Dialog>
      </Box>
    </Container>
  );
};

export default ElectionDashboard; 