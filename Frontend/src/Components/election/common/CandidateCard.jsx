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
    <StyledCard>
      <StyledMedia
        component="img"
        image={candidate.photoUrl}
        alt={candidate.name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, color: '#2C3E50' }}
        >
          {candidate.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Position: {candidate.position}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Department: {candidate.department}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontSize: '0.85rem', lineHeight: 1.4, color: '#4A5568' }}
          >
            {candidate.manifesto}
          </Typography>
        </Box>
        {!isAdmin && (
          <StyledButton
            fullWidth
            variant="contained"
            onClick={() => onVote(candidate._id)}
            disabled={hasVoted}
          >
            {hasVoted ? 'Already Voted' : 'Vote'}
          </StyledButton>
        )}
        {isAdmin && (
          <Typography
            variant="subtitle1"
            sx={{ mt: 1.5, textAlign: 'center', color: '#4A5568', fontWeight: 500 }}
          >
            Votes: {candidate.votes}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default CandidateCard;
