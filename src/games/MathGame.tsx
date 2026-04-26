import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, Delete } from 'lucide-react';
import { GameProps } from '../types';
import { useAudio } from '../components/AudioProvider';
import { useScore } from '../components/ScoreProvider';
import Timer from '../components/Timer';
import CorrectAnimation from '../components/CorrectAnimation';
import { QuestionData } from '../data/mathData';

interface MathGameProps extends GameProps {
  questions: QuestionData[];
  theme: {
    bgFrom: string;
    bgTo: string;
    borderColor: string;
    textColor: string;
    accentColor: string;
    shadowColor: string;
  };
}

export default function MathGame({ questions, onComplete, onExit, theme }: MathGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isCorrectAttr, setIsCorrectAttr] = useState<boolean | null>(null);
  const { playSfx, stopSpeak } = useAudio();
  const { addScore } = useScore();

  const q = questions[currentIdx];
  const targetAnswer = q.options.find(o => o.isCorrect)?.text || '';

  useEffect(() => {
    return () => stopSpeak();
  }, [stopSpeak]);

  const handleKeyClick = (key: string) => {
    if (isCorrectAttr !== null) return;
    
    if (key === 'del') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (inputValue.length < 3) {
      setInputValue(prev => prev + key);
    }
  };

  const handleCheck = () => {
    if (!inputValue || isCorrectAttr !== null) return;
    
    const isCorrect = inputValue === targetAnswer;
    setIsCorrectAttr(isCorrect);
    
    if (isCorrect) {
      addScore(50);
      playSfx('correct');
      if ((currentIdx + 1) % 5 === 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      addScore(-20);
      playSfx('wrong');
      setTimeout(() => {
        setInputValue('');
        setIsCorrectAttr(null);
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setInputValue('');
      setIsCorrectAttr(null);
    } else {
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 } });
      playSfx('win');
      onComplete();
    }
  };

  const handleTimeUp = () => {
    if (isCorrectAttr !== null) return;
    setIsCorrectAttr(false);
    addScore(-20);
    playSfx('timeout');
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgFrom} ${theme.bgTo} p-4 sm:p-6 flex flex-col items-center relative overflow-hidden`}>
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-4 sm:mb-8 z-10">
         <button onClick={onExit} className="w-14 h-14 bg-white border-[3px] border-black/10 rounded-2xl text-black/60 hover:bg-black/5 flex items-center justify-center transition-all shrink-0">
           <ArrowLeft size={32} />
         </button>
         
         <div className="flex-1 mx-4 sm:mx-8 flex flex-col items-center">
           <div className="font-display font-bold text-lg mb-1 tracking-wide uppercase" style={{ color: theme.accentColor }}>
              Pregunta {currentIdx + 1}/{questions.length}
           </div>
           <div className="w-full relative h-6 bg-white border-[4px] border-black/10 rounded-full overflow-hidden shadow-inner flex items-center">
             <motion.div className="absolute top-0 left-0 bottom-0 rounded-full" style={{ backgroundColor: theme.accentColor }} initial={{ width: 0 }} animate={{ width: `${Math.round(((currentIdx + 1) / questions.length) * 100)}%` }} />
           </div>
         </div>
         
         <div className="scale-110 hidden sm:block">
           <Timer initialSeconds={45} onTimeUp={handleTimeUp} resetKey={currentIdx} />
         </div>
      </div>

      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center z-10">
        <CorrectAnimation isVisible={isCorrectAttr === true} />
        
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full flex flex-col items-center">
            
            <div className={`bg-white rounded-3xl p-8 sm:p-12 border-4 ${theme.borderColor} ${theme.shadowColor} mb-8 w-full`}>
               <h2 className={`text-4xl sm:text-6xl font-display font-bold text-center ${theme.textColor} leading-tight drop-shadow-sm uppercase tracking-widest`}>
                 {q.questionText}
               </h2>
               
               <div className="mt-8 flex items-center justify-center border-b-8 border-dashed border-black/20 pb-4 relative min-h-[100px]">
                  {inputValue ? (
                    <span className={`text-6xl sm:text-8xl font-display font-bold ${isCorrectAttr === false ? 'text-red-500 animate-shake' : isCorrectAttr === true ? 'text-green-500' : theme.textColor}`}>{inputValue}</span>
                  ) : (
                    <span className="text-6xl sm:text-8xl font-display font-bold text-black/20">?</span>
                  )}
               </div>
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-4 w-full px-4 mb-8">
               {[1,2,3,4,5,6,7,8,9,'del',0,'check'].map((key, i) => {
                 if (key === 'del') {
                    return (
                      <button key={key} onClick={() => handleKeyClick('del')} className="bg-red-100 border-4 border-red-300 text-red-500 rounded-2xl h-20 sm:h-24 flex items-center justify-center text-3xl font-display font-bold shadow-[0_6px_0_#fca5a5] active:translate-y-1 active:shadow-none transition-all">
                        <Delete size={32} />
                      </button>
                    )
                 }
                 if (key === 'check') {
                    return (
                      <button key={key} onClick={handleCheck} disabled={!inputValue} className={`border-4 rounded-2xl h-20 sm:h-24 flex items-center justify-center text-3xl font-display font-bold transition-all ${inputValue ? 'bg-green-100 border-green-400 text-green-600 shadow-[0_6px_0_#4ade80] active:translate-y-1 active:shadow-none' : 'bg-gray-100 border-gray-300 text-gray-400 shadow-none opacity-50'}`}>
                        <CheckCircle2 size={40} />
                      </button>
                    )
                 }
                 return (
                   <button key={key} onClick={() => handleKeyClick(key.toString())} className={`bg-white border-4 border-gray-200 text-gray-700 rounded-2xl h-20 sm:h-24 flex items-center justify-center text-4xl sm:text-5xl font-display font-bold active:translate-y-1 active:shadow-none transition-all`} style={{ boxShadow: '0 6px 0 shadow-gray-200' }}>
                     {key}
                   </button>
                 )
               })}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sm:hidden mt-2 mb-4 z-10 w-full flex justify-center">
         <Timer initialSeconds={45} onTimeUp={handleTimeUp} resetKey={currentIdx} />
      </div>
    </div>
  );
}
