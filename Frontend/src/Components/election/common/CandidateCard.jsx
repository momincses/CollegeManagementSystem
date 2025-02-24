import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

// 🌿 Compact, elegant card styling
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 280,
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
  },
}));

// 🖼️ Compact media with consistent image aspect ratio
const StyledMedia = styled(CardMedia)({
  height: 180,
  objectFit: 'cover',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
});

// 🌟 Subtle vote button
const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: '#2D3748',
  '&:hover': {
    backgroundColor: '#1A202C',
  },
  '&:disabled': {
    backgroundColor: '#E2E8F0',
    color: '#A0AEC0',
  },
}));

const CandidateCard = ({ candidate, onVote, hasVoted, isAdmin }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={candidate.photoUrl}
        alt={candidate.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {candidate.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Position: {candidate.position}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {candidate.manifesto}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
