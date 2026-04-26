import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { GameProps } from '../types';
import { antonymsQuestions } from '../data';
import { useAudio } from '../components/AudioProvider';
import { useScore } from '../components/ScoreProvider';
import Timer from '../components/Timer';
import CorrectAnimation from '../components/CorrectAnimation';

export default function AntonymsGame({ onComplete, onExit }: GameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isCorrectAttr, setIsCorrectAttr] = useState<boolean | null>(null);
  const { playSfx, stopSpeak } = useAudio();
  const { addScore } = useScore();

  const q = antonymsQuestions[currentIdx];
  const targetWord = q.word ? q.word.toUpperCase() : "PALABRA";

  useEffect(() => {
    return () => {
      stopSpeak();
    };
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
          colors: ['#4FB0FF', '#9D4EDD', '#06D6A0', '#FFD166']
        });
      }
      setTimeout(() => {
        if (currentIdx < antonymsQuestions.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setSelectedOpt(null);
          setIsCorrectAttr(null);
        } else {
          confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 } });
          playSfx('win');
          onComplete();
        }
      }, 1500);
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
    setSelectedOpt(-1);
    setIsCorrectAttr(false);
    addScore(-20);
    playSfx('timeout');
    setTimeout(() => {
      setSelectedOpt(null);
      setIsCorrectAttr(null);
      if (currentIdx < antonymsQuestions.length - 1) {
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

  const progress = Math.round(((currentIdx + 1) / antonymsQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-[#f4fbfc] p-4 sm:p-6 flex flex-col items-center relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-60 pointer-events-none -ml-20 -mb-20"></div>

      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-4 sm:mb-8 z-10">
         <button 
           onClick={onExit}
           className="w-14 h-14 bg-white border-[3px] border-[#e6eef2] rounded-2xl shadow-[0_4px_0_#d1e0e8] text-[#A59580] hover:bg-[#F9F4F0] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none shrink-0"
         >
           <ArrowLeft size={32} />
         </button>
         
         <div className="flex-1 mx-4 sm:mx-8 flex flex-col items-center">
           <div className="text-[#3FCF8E] font-display font-bold text-lg mb-1 tracking-wide uppercase">
              Pregunta {currentIdx + 1}/{antonymsQuestions.length}
           </div>
           <div className="w-full relative h-6 bg-white border-[4px] border-[#e6eef2] rounded-full overflow-hidden shadow-inner flex items-center">
             <motion.div 
               className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
             />
           </div>
         </div>
         
         <div className="scale-110 hidden sm:block">
           {timerComponent}
         </div>
      </div>

      <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center z-10 w-full relative">
        <CorrectAnimation isVisible={selectedOpt !== null && isCorrectAttr === true} />
        
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-center text-[#2B8A3E] mb-8 leading-tight drop-shadow-sm uppercase">
          Encuentra el contrario
        </h2>

        <AnimatePresence mode="wait">
          <motion.div 
             key={currentIdx}
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
             className="w-full flex flex-col items-center"
          >
            {/* The pair target area */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 mb-12">
              <div className="bg-[#40C057] text-white border-8 border-white shadow-[0_12px_0_#2B8A3E] rounded-3xl w-64 h-40 flex items-center justify-center font-display font-bold text-4xl transform -rotate-2">
                {targetWord}
              </div>

              <div className="text-5xl font-bold text-[#40C057] animate-pulse">
                &harr;
              </div>

              <div className={`border-8 border-dashed ${selectedOpt !== null && isCorrectAttr ? 'border-transparent' : 'border-[#40C057] opacity-60'} rounded-3xl w-64 h-40 flex items-center justify-center relative`}>
                {selectedOpt !== null && isCorrectAttr ? (
                   <motion.div initial={{scale:0}} animate={{scale:1}} className="bg-[#FFD166] text-[#8B7300] border-8 border-white shadow-[0_12px_0_#DDAA00] rounded-3xl w-64 h-40 flex items-center justify-center font-display font-bold text-4xl absolute inset-0 -ml-2 -mt-2 transform rotate-2 z-20">
                     {q.options[selectedOpt].text}
                     <CheckCircle2 className="absolute -top-4 -right-4 bg-white rounded-full text-green-500" size={40} />
                   </motion.div>
                ) : selectedOpt !== null && !isCorrectAttr ? (
                   <motion.div initial={{scale:0}} animate={{scale:1}} className="bg-[#FFA8A8] text-[#C92A2A] border-8 border-white shadow-[0_12px_0_#FA5252] rounded-3xl w-64 h-40 flex flex-col items-center justify-center font-display font-bold text-4xl absolute inset-0 -ml-2 -mt-2 transform rotate-2 z-20">
                     <span className="line-through">{selectedOpt === -1 ? '---' : q.options[selectedOpt]?.text || ''}</span>
                     <XCircle className="mt-2 text-[#C92A2A]" size={32} />
                   </motion.div>
                ) : (
                  <span className="text-3xl font-display text-[#40C057] uppercase font-bold">?</span>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-row justify-center gap-6 sm:gap-10 flex-wrap w-full max-w-3xl">
              {q.options.map((opt: any, idx: number) => {
                const hidden = selectedOpt === idx;
                
                return (
                  <motion.button
                    whileHover={selectedOpt === null ? { scale: 1.05 } : {}}
                    whileTap={selectedOpt === null ? { scale: 0.95 } : {}}
                    key={idx}
                    onClick={() => handleSelect(idx, opt.isCorrect)}
                    className={`py-6 px-8 rounded-3xl text-3xl font-display font-bold transition-all relative tracking-wide flex items-center justify-center bg-white border-4 border-[#40C057] text-[#2B8A3E] shadow-[0_8px_0_#8CE99A] uppercase ${hidden ? 'opacity-0 scale-50 pointer-events-none' : ''}`}
                    disabled={selectedOpt !== null}
                  >
                    <span>{opt.text}</span>
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

