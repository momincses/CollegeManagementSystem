import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage; 