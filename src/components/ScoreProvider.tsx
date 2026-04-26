import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScoreContextType {
  score: number;
  addScore: (points: number) => void;
  resetScore: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  const addScore = (points: number) => {
    setScore((prev) => Math.max(0, prev + points));
  };

  const resetScore = () => {
    setScore(0);
  };

  return (
    <ScoreContext.Provider value={{ score, addScore, resetScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) throw new Error('useScore must be used within ScoreProvider');
  return context;
};
