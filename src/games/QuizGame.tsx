import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useAudio } from '../components/AudioProvider';
import { useScore } from '../components/ScoreProvider';
import Timer from '../components/Timer';
import CorrectAnimation from '../components/CorrectAnimation';

export interface QuizQuestion {
  emoji?: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface QuizGameProps {
  questions: QuizQuestion[];
  onComplete: () => void;
  onExit: () => void;
  theme: {
    bgFrom: string;
    bgTo: string;
    borderColor: string;
    textColor: string;
    accentColor: string;
    shadowColor: string;
  };
}

export default function QuizGame({ questions, onComplete, onExit, theme }: QuizGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isCorrectAttr, setIsCorrectAttr] = useState<boolean | null>(null);
  const { playSfx, stopSpeak } = useAudio();
  const { addScore } = useScore();

  const q = questions[currentIdx];

  useEffect(() => {
    return () => stopSpeak();
  }, [stopSpeak]);

  const handleSelect = (idx: number, isCorrect: boolean) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    setIsCorrectAttr(isCorrect);

    if (isCorrect) {
      addScore(50);
      playSfx('correct');
      if ((currentIdx + 1) % 10 === 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B9E', '#4FB0FF', '#FFD166', '#06D6A0']
        });
      }
      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setSelectedOpt(null);
          setIsCorrectAttr(null);
        } else {
          confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 } });
          playSfx('win');
          onComplete();
        }
      }, 1000);
    } else {
      addScore(-20);
      playSfx('wrong');
      setTimeout(() => {
        setSelectedOpt(null);
        setIsCorrectAttr(null);
      }, 1500);
    }
  };

  const handleTimeUp = () => {
    if (selectedOpt !== null) return;
    setSelectedOpt(-1); // dummy value to lock options
    setIsCorrectAttr(false);
    addScore(-20);
    playSfx('timeout');
    setTimeout(() => {
      setSelectedOpt(null);
      setIsCorrectAttr(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 } });
        playSfx('win');
        onComplete();
      }
    }, 1500);
  };

  const timerComponent = (
    <Timer 
      initialSeconds={30} 
      onTimeUp={handleTimeUp} 
      resetKey={currentIdx} 
    />
  );

  const progress = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#f4fbfc] p-4 sm:p-6 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-60 pointer-events-none -ml-20 -mb-20"></div>

      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8 sm:mb-12 z-10">
         <button 
           onClick={onExit}
           className="w-14 h-14 bg-white border-[3px] border-[#e6eef2] rounded-2xl shadow-[0_4px_0_#d1e0e8] text-[#A59580] hover:bg-[#F9F4F0] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none shrink-0"
         >
           <ArrowLeft size={32} />
         </button>
         
         <div className="flex-1 mx-4 sm:mx-8 flex flex-col items-center">
           <div className="text-[#FF6B9E] font-display font-bold text-lg mb-1 tracking-wide uppercase">
              Pregunta {currentIdx + 1}/{questions.length}
           </div>
           <div className="w-full relative h-6 bg-white border-[4px] border-[#e6eef2] rounded-full overflow-hidden shadow-inner flex items-center">
             <motion.div 
               className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
             />
           </div>
         </div>
         
         <div className="scale-110 hidden sm:block">
           {timerComponent}
         </div>
      </div>

      <div className="flex-1 w-full max-w-3xl flex items-center justify-center z-10 w-full">
        <CorrectAnimation isVisible={selectedOpt !== null && isCorrectAttr === true} />
        <AnimatePresence mode="wait">
          <motion.div 
             key={currentIdx}
             initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             exit={{ opacity: 0, scale: 0.8, rotate: 2, transition: { duration: 0.2 } }}
             transition={{ type: 'spring', bounce: 0.5, duration: 0.5 }}
             className={`w-full bg-gradient-to-b ${theme.bgFrom} ${theme.bgTo} rounded-[40px] border-[8px] border-white p-8 sm:p-12 flex flex-col items-center justify-center ${theme.shadowColor} relative`}
          >
            {q.emoji && (
              <div className={`w-36 h-36 bg-white rounded-full flex items-center justify-center mb-6 shadow-md shrink-0 border-4 ${theme.borderColor} absolute -top-20 z-20 transform transition-transform hover:scale-110 hover:rotate-6`}>
                <span className="text-7xl">{q.emoji}</span>
              </div>
            )}
            
            <h2 className={`text-4xl sm:text-6xl ${q.questionText.includes('\n') ? 'font-mono' : 'font-display'} font-bold text-center whitespace-pre-wrap ${theme.textColor} ${q.emoji ? 'mt-8' : ''} mb-10 leading-tight drop-shadow-sm uppercase`}>
              {q.questionText}
            </h2>

            <div className="flex flex-col gap-5 w-full max-w-md">
              {q.options.map((opt, idx) => {
                let btnClass = `bg-white border-[4px] border-white ${theme.textColor} shadow-[0_8px_0_${theme.accentColor}]`;
                let contentClass = "";
                
                if (selectedOpt === idx) {
                  if (isCorrectAttr) {
                    btnClass = "bg-[#B2F2BB] text-[#2B8A3E] border-[4px] border-white scale-105 shadow-[0_8px_0_#51CF66]";
                  } else {
                     btnClass = "bg-[#FFA8A8] text-[#C92A2A] border-[4px] border-white animate-shake shadow-[0_8px_0_#FA5252]";
                  }
                } else if (selectedOpt !== idx && selectedOpt !== null) {
                  btnClass += " opacity-50 translate-y-2 shadow-none";
                  contentClass = "opacity-50";
                }

                return (
                  <motion.button
                    whileHover={selectedOpt === null ? { scale: 1.02 } : {}}
                    whileTap={selectedOpt === null ? { scale: 0.95 } : {}}
                    key={idx}
                    onClick={() => handleSelect(idx, opt.isCorrect)}
                    className={`py-5 px-6 rounded-[24px] text-2xl sm:text-3xl font-display font-bold transition-all relative tracking-wide flex items-center justify-center ${btnClass}`}
                    disabled={selectedOpt !== null}
                  >
                    <span className={contentClass}>{opt.text}</span>
                    {selectedOpt === idx && isCorrectAttr && (
                       <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 drop-shadow-sm" size={32} />
                    )}
                    {selectedOpt === idx && isCorrectAttr === false && (
                       <XCircle className="absolute right-6 top-1/2 -translate-y-1/2 drop-shadow-sm" size={32} />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="sm:hidden mt-6 mb-4 z-10 w-full flex justify-center">
         {timerComponent}
      </div>
    </div>
  );
}
