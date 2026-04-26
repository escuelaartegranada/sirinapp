import React from 'react';

export interface GameProps {
  onComplete: () => void;
  onExit: () => void;
  key?: React.Key;
}

