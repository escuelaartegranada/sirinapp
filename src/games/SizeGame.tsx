import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { GameProps } from '../types';
import { sizeQuestions } from '../data';
import { useAudio } from '../components/AudioProvider';
import { useScore } from '../components/ScoreProvider';
import Timer from '../components/Timer';
import CorrectAnimation from '../components/CorrectAnimation';

type GameMode = 'test' | 'categorize' | 'typing';

export default function SizeGame({ onComplete, onExit }: GameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isCorrectAttr, setIsCorrectAttr] = useState<boolean | null>(null);
  const [wordToShow, setWordToShow] = useState<string>('');
  const [correctCategory, setCorrectCategory] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('categorize');
  const [typedAnswer, setTypedAnswer] = useState<string>('');

  const { playSfx, stopSpeak } = useAudio();
  const { addScore } = useScore();

  const q = sizeQuestions[currentIdx];

  useEffect(() => {
    // Choose mode based on index to ensure variety
    const modeSwitch = currentIdx % 3;
    if (modeSwitch === 0) setGameMode('test');
    else if (modeSwitch === 1) setGameMode('categorize');
    else setGameMode('typing');
    
    setTypedAnswer('');

    // For categorize mode, use logic to determine shown word and category
    const wordOptionIndex = currentIdx % 3;
    const currentWordInfo = q.options[wordOptionIndex];
    const wordText = currentWordInfo.text;
    
    setWordToShow(wordText);

    let category = 'Normal';
    if (wordText === q.rootWord) {
      category = 'Normal';
    } else {
      const isPequeñoQuestion = q.questionText.includes("PEQUEÑO");
      if (isPequeñoQuestion) {
        category = currentWordInfo.isCorrect ? 'Pequeño' : 'Grande';
      } else {
        category = currentWordInfo.isCorrect ? 'Grande' : 'Pequeño';
      }
    }
    setCorrectCategory(category);
  }, [currentIdx, q]);

  useEffect(() => {
    return () => {
      stopSpeak();
    };
  }, [stopSpeak]);

  const handleSelectCategory = (category: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(category);
    evaluateAnswer(category === correctCategory);
  };

  const handleSelectTest = (optText: string, isCorrect: boolean) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optText);
    evaluateAnswer(isCorrect);
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim() || selectedOpt !== null) return;
    
    const correctOpt = q.options.find((o: any) => o.isCorrect)?.text || '';
    const isCorrect = typedAnswer.trim().toLowerCase() === correctOpt.trim().toLowerCase();
    
    setSelectedOpt(typedAnswer);
    evaluateAnswer(isCorrect);
  };

  const evaluateAnswer = (isCorrect: boolean) => {
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
        if (currentIdx < sizeQuestions.length - 1) {
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
        if (gameMode === 'typing') setTypedAnswer('');
      }, 1500);
    }
  };

  const handleTimeUp = () => {
    if (selectedOpt !== null) return;
    setSelectedOpt('TIMEOUT');
    setIsCorrectAttr(false);
    addScore(-20);
    playSfx('timeout');
    setTimeout(() => {
      setSelectedOpt(null);
      setIsCorrectAttr(null);
      if (currentIdx < sizeQuestions.length - 1) {
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
      initialSeconds={45} 
      onTimeUp={handleTimeUp} 
      resetKey={currentIdx} 
    />
  );

  const progress = Math.round(((currentIdx + 1) / sizeQuestions.length) * 100);

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
            <div className="text-[#D6336C] font-display font-bold text-lg mb-1 tracking-wide uppercase">
               Pregunta {currentIdx + 1}/{sizeQuestions.length}
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

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center z-10 w-full relative">
        <CorrectAnimation isVisible={selectedOpt !== null && isCorrectAttr === true} />
        
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-center text-[#D6336C] mb-8 leading-tight drop-shadow-sm uppercase">
          {gameMode === 'categorize' ? "Clasifica la palabra" : q.questionText}
        </h2>

        <AnimatePresence mode="wait">
          <motion.div 
             key={currentIdx}
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
             className="w-full flex flex-col items-center relative"
          >
            {gameMode === 'categorize' && (
              <>
                <div className="bg-white rounded-3xl p-6 sm:p-12 border-4 border-[#FF85A1] shadow-[0_12px_0_#FFB3C6] mb-12 max-w-xl w-full relative flex flex-col items-center">
                  <div className="absolute -top-10 bg-white rounded-full p-2 border-4 border-[#FF85A1]">
                    <span className="text-5xl">{q.emoji || '📏'}</span>
                  </div>
                  <p className="text-5xl sm:text-7xl font-display font-bold text-slate-800 text-center tracking-tight mt-6 uppercase">
                    {wordToShow}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-3xl justify-center mb-8">
                   {['Pequeño', 'Normal', 'Grande'].map((c) => {
                     let bgColor = 'bg-blue-100 border-blue-400 text-blue-700 shadow-[0_8px_0_#60a5fa] hover:bg-blue-200 hover:-translate-y-1';
                     if (c === 'Pequeño') bgColor = 'bg-yellow-100 border-yellow-400 text-yellow-700 shadow-[0_8px_0_#facc15] hover:bg-yellow-200 hover:-translate-y-1';
                     if (c === 'Grande') bgColor = 'bg-green-100 border-green-400 text-green-700 shadow-[0_8px_0_#4ade80] hover:bg-green-200 hover:-translate-y-1';

                     if (selectedOpt !== null) {
                        if (c === correctCategory && isCorrectAttr === true) {
                           bgColor = 'bg-[#40C057] border-[#2B8A3E] text-white shadow-[0_8px_0_#2B8A3E] scale-105';
                        } else if (c === selectedOpt && isCorrectAttr === false) {
                           bgColor = 'bg-[#FA5252] border-[#C92A2A] text-white shadow-none translate-y-2 opacity-80';
                        } else if (c !== correctCategory) {
                           bgColor = 'bg-slate-100 border-slate-300 text-slate-400 shadow-none opacity-50 translate-y-2';
                        }
                     }

                     return (
                       <button
                         key={c}
                         onClick={() => handleSelectCategory(c)}
                         disabled={selectedOpt !== null}
                         className={`flex-1 min-h-[100px] border-4 rounded-3xl flex flex-col items-center justify-center p-4 transition-all duration-300 font-display font-bold text-2xl sm:text-3xl active:translate-y-2 active:shadow-none ${bgColor}`}
                       >
                         {c === 'Pequeño' && <span className="text-xl opacity-80 mb-2">🌱 (ito)</span>}
                         {c === 'Normal' && <span className="text-xl opacity-80 mb-2">🏠</span>}
                         {c === 'Grande' && <span className="text-xl opacity-80 mb-2">🌲 (azo)</span>}
                         {c.toUpperCase()}
                       </button>
                     );
                   })}
                </div>
              </>
            )}

            {gameMode === 'test' && (
              <>
                <div className="w-24 h-24 mb-8 bg-white rounded-full flex items-center justify-center border-4 border-[#FF85A1] shadow-md z-10 mx-auto">
                    <span className="text-5xl">{q.emoji || '📏'}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-3xl justify-center mb-8 flex-wrap">
                  {q.options.map((opt: any, idx: number) => {
                    let btnBg = "bg-white border-4 border-pink-200 text-pink-600 shadow-[0_8px_0_#fbcfe8]";
                    if (selectedOpt === opt.text) {
                      if (isCorrectAttr) btnBg = "bg-[#B2F2BB] text-[#2B8A3E] border-[#2B8A3E] scale-110 shadow-[0_8px_0_#51CF66]";
                      else btnBg = "bg-[#FFA8A8] text-[#C92A2A] border-[#C92A2A] animate-shake shadow-[0_8px_0_#FA5252]";
                    } else if (selectedOpt !== null) {
                      btnBg += " opacity-50 translate-y-2 shadow-none";
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!selectedOpt ? { scale: 1.05 } : {}}
                        whileTap={!selectedOpt ? { scale: 0.95 } : {}}
                        onClick={() => handleSelectTest(opt.text, opt.isCorrect)}
                        disabled={selectedOpt !== null}
                        className={`flex-1 min-w-[200px] py-6 px-4 rounded-3xl text-2xl sm:text-3xl font-display font-bold transition-all uppercase flex justify-center items-center gap-2 ${btnBg}`}
                      >
                        {opt.text}
                        {selectedOpt === opt.text && isCorrectAttr === true && <CheckCircle2 size={32} />}
                        {selectedOpt === opt.text && isCorrectAttr === false && <XCircle size={32} />}
                      </motion.button>
                    )
                  })}
                </div>
              </>
            )}

            {gameMode === 'typing' && (
              <form onSubmit={handleTypeSubmit} className="flex flex-col items-center w-full max-w-md gap-4">
                 <div className="w-24 h-24 mb-6 bg-white rounded-full flex items-center justify-center border-4 border-[#FF85A1] shadow-md z-10 mx-auto">
                    <span className="text-5xl">{q.emoji || '📏'}</span>
                 </div>
                 <input 
                   type="text"
                   value={typedAnswer}
                   onChange={(e) => setTypedAnswer(e.target.value)}
                   disabled={selectedOpt !== null}
                   placeholder="Escribe la palabra..."
                   className="w-full p-6 rounded-3xl text-3xl font-display font-bold text-center border-4 border-[#FF85A1] shadow-inner bg-white/90 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all uppercase"
                   autoFocus
                 />
                 <button 
                   type="submit"
                   disabled={selectedOpt !== null || !typedAnswer.trim()}
                   className="w-full py-4 mt-2 rounded-3xl bg-pink-500 text-white font-display font-bold text-3xl border-4 border-pink-700 shadow-[0_8px_0_#be185d] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_8px_0_#be185d]"
                 >
                   COMPROBAR
                 </button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sm:hidden mt-2 mb-4 z-10 w-full flex justify-center">
         {timerComponent}
      </div>
    </div>
  );
}


