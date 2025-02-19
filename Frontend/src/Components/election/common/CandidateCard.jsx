import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';

const CandidateCard = ({ candidate, onVote, hasVoted, isAdmin }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="240"
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
          Department: {candidate.department}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            {candidate.manifesto}
          </Typography>
        </Box>
        {!isAdmin && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => onVote(candidate._id)}
            disabled={hasVoted}
            sx={{ mt: 2 }}
          >
            {hasVoted ? 'Already Voted' : 'Vote'}
          </Button>
        )}
        {isAdmin && (
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Votes: {candidate.votes}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateCard; 