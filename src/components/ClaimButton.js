import React from 'react';
import { Button } from '@mui/material';

const ClaimButton = ({ userId, onClaim, disabled }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => onClaim(userId)}
      disabled={!userId || disabled}
      fullWidth
      type="button"
    >
      Claim
    </Button>
  );
};

export default ClaimButton; 