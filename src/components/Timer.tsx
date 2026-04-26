import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialSeconds?: number;
  onTimeUp?: () => void;
  resetKey?: any;
}

export default function Timer({ initialSeconds = 20, onTimeUp, resetKey }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [resetKey, initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      if (onTimeUp) {
        onTimeUp();
      }
      return;
    }
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const isWarning = seconds <= 5;

  return (
    <div className={`bg-white px-5 py-2.5 rounded-full border-[3px] flex items-center gap-3 shadow-[0_4px_0_#d1e0e8] shrink-0 transition-colors ${isWarning ? 'border-red-400 !shadow-[0_4px_0_#f87171] animate-pulse bg-red-50' : 'border-[#e6eef2]'}`}>
      <span className={`text-2xl ${isWarning ? 'animate-bounce' : 'animate-pulse'}`}>⏱️</span>
      <span className={`font-display font-bold text-2xl tracking-widest ${isWarning ? 'text-red-500' : 'text-slate-500'}`}>
        00:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
