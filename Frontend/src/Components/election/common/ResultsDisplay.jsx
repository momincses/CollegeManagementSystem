import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress, 
  Container,
  Grid,
  Card,
  CardContent 
} from '@mui/material';
import { io } from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultsDisplay = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // Initial fetch of results
    fetchResults();

    // Setup Socket.io connection
    const socket = io('http://localhost:5000');
    
    socket.on('voteUpdate', (updatedResults) => {
      setResults(updatedResults);
      calculateTotalVotes(updatedResults);
    });

    return () => socket.disconnect();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/election/results');
      const data = await response.json();
      setResults(data);
      calculateTotalVotes(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch results');
      setLoading(false);
    }
  };

  const calculateTotalVotes = (data) => {
    const total = data.reduce((sum, candidate) => sum + candidate.votes, 0);
    setTotalVotes(total);
  };

  const chartData = {
    labels: results.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Votes',
        data: results.map(candidate => candidate.votes),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Election Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Live Election Results
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom align="center">
          Total Votes Cast: {totalVotes}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {results.map((candidate) => (
            <Grid item xs={12} sm={6} md={4} key={candidate._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {candidate.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Position: {candidate.position}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 2, textAlign: 'center' }}>
                    {candidate.votes}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    votes
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(candidate.votes / Math.max(totalVotes, 1)) * 100}
                    sx={{ mt: 2 }}
                  />
                  <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                    {((candidate.votes / Math.max(totalVotes, 1)) * 100).toFixed(1)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ height: 400 }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResultsDisplay; 