import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { GameProps } from "../types";
import { verbsQuestions } from "../data";
import { useAudio } from "../components/AudioProvider";
import { useScore } from "../components/ScoreProvider";
import Timer from "../components/Timer";
import CorrectAnimation from "../components/CorrectAnimation";

export default function VerbsGame({ onComplete, onExit }: GameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isTypingMode, setIsTypingMode] = useState<boolean>(false);
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  const { playSfx, stopSpeak } = useAudio();
  const { addScore } = useScore();

  const q = verbsQuestions[currentIdx];

  useEffect(() => {
    // 30% chance for typing mode
    setIsTypingMode(Math.random() < 0.3);
    setTypedAnswer("");
  }, [currentIdx]);

  useEffect(() => {
    return () => {
      stopSpeak();
    };
  }, [stopSpeak]);

  const getTimeEmoji = (time: string) => {
    switch (time) {
      case "Ayer":
        return "⬅️⏳";
      case "Hoy":
        return "✅⏳";
      case "Mañana":
        return "➡️⏳";
      default:
        return "⏳";
    }
  };

  const handleSelect = (opt: string) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);

    const isCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      addScore(50);
      playSfx("correct");
      if ((currentIdx + 1) % 10 === 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E67700", "#FFE066"],
        });
      }
      setTimeout(() => {
        if (currentIdx < verbsQuestions.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedOpt(null);
        } else {
          confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 } });
          playSfx("win");
          onComplete();
        }
      }, 1000);
    } else {
      addScore(-20);
      playSfx("wrong");
      setTimeout(() => {
        setSelectedOpt(null);
        if (isTypingMode) setTypedAnswer(""); // reset typed answer on wrong so they can try again or wait for timeout? Usually it waits on the wrong answer, but here we just clear. Wait, actually we can just let them retry or we let the error show. Let's just clear selection so they can try again.
      }, 1500);
    }
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;
    handleSelect(typedAnswer);
  };

  const handleTimeUp = () => {
    if (selectedOpt !== null) return;
    setSelectedOpt('---'); // dummy value to lock options
    addScore(-20);
    playSfx("timeout");
    setTimeout(() => {
      setSelectedOpt(null);
      if (currentIdx < verbsQuestions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 } });
        playSfx("win");
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

  const progress = Math.round(((currentIdx + 1) / verbsQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-[#f4fbfc] p-4 sm:p-6 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-60 pointer-events-none -ml-20 -mb-20"></div>

      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-8 sm:mb-12 z-10">
        <button
          onClick={onExit}
          className="w-14 h-14 bg-white border-[3px] border-[#e6eef2] rounded-2xl shadow-[0_4px_0_#d1e0e8] text-[#A59580] hover:bg-[#F9F4F0] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none shrink-0"
        >
          <ArrowLeft size={32} />
        </button>

        <div className="flex-1 mx-4 sm:mx-8 flex flex-col items-center">
           <div className="text-[#E67700] font-display font-bold text-lg mb-1 tracking-wide uppercase">
              Pregunta {currentIdx + 1}/{verbsQuestions.length}
           </div>
           <div className="w-full relative h-6 bg-white border-[4px] border-[#e6eef2] rounded-full overflow-hidden shadow-inner flex items-center">
             <motion.div
               className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
             />
           </div>
        </div>

        <div className="scale-110 hidden sm:block">
          {timerComponent}
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex items-center justify-center z-10">
        <CorrectAnimation
          isVisible={selectedOpt !== null && selectedOpt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.2 } }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
            className="w-full bg-gradient-to-b from-[#FFF5C3] to-[#FFE066] rounded-[40px] border-[8px] border-white p-8 sm:p-12 flex flex-col items-center justify-center shadow-[0_16px_0_rgba(230,119,0,0.3)] relative"
          >
            <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center mb-6 shadow-md shrink-0 border-4 border-[#FAB005] absolute -top-20 z-20 transform transition-transform hover:scale-110 hover:rotate-6">
              <span className="text-7xl">{getTimeEmoji(q.timeIndicator)}</span>
            </div>

            <div className="text-3xl sm:text-4xl lg:text-5xl text-center font-display font-bold text-[#E67700] mb-12 mt-10 flex flex-wrap justify-center items-center gap-x-3 gap-y-6 leading-loose tracking-wide drop-shadow-sm">
              <span>{q.textParts[0]}</span>
              <div
                className={`min-w-[140px] sm:min-w-[180px] border-b-8 border-dashed inline-block text-center font-bold px-4 rounded-2xl relative ${selectedOpt ? (selectedOpt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ? "bg-[#FFE066] text-[#E67700] border-[#E67700] shadow-inner" : "bg-[#FFA8A8] text-[#C92A2A] border-[#C92A2A] animate-shake shadow-inner") : "border-[#E67700] opacity-50 text-transparent"}`}
              >
                <span className="relative z-10">{selectedOpt || (isTypingMode ? "______" : "______")}</span>
              </div>
              <span>{q.textParts[1]}</span>
            </div>

            {isTypingMode ? (
              <form onSubmit={handleTypeSubmit} className="flex flex-col items-center w-full max-w-sm gap-4">
                 <input 
                   type="text"
                   value={typedAnswer}
                   onChange={(e) => setTypedAnswer(e.target.value)}
                   disabled={selectedOpt !== null}
                   placeholder="Escribe el verbo..."
                   className="w-full p-6 rounded-3xl text-3xl font-display font-bold text-center border-4 border-white shadow-inner bg-white/70 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all uppercase"
                   autoFocus
                 />
                 <button 
                   type="submit"
                   disabled={selectedOpt !== null || !typedAnswer.trim()}
                   className="w-full py-4 rounded-3xl bg-green-400 text-white font-display font-bold text-3xl border-4 border-white shadow-[0_8px_0_#2b8a3e] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_8px_0_#2b8a3e]"
                 >
                   COMPROBAR
                 </button>
              </form>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
                {q.options.map((opt: string, idx: number) => {
                  let btnBg =
                    "bg-white border-[4px] border-white text-[#E67700] shadow-[0_8px_0_#FFE066]";
                  if (selectedOpt === opt) {
                    if (selectedOpt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
                      btnBg =
                        "bg-[#B2F2BB] text-[#2B8A3E] border-[4px] border-white scale-110 shadow-[0_8px_0_#51CF66]";
                    } else {
                      btnBg =
                        "bg-[#FFA8A8] text-[#C92A2A] border-[4px] border-white animate-shake shadow-[0_8px_0_#FA5252]";
                    }
                  } else if (selectedOpt && opt !== q.correctAnswer) {
                    btnBg += " opacity-50 translate-y-2 shadow-none";
                  }

                  return (
                    <motion.button
                      whileHover={!selectedOpt ? { scale: 1.05 } : {}}
                      whileTap={!selectedOpt ? { scale: 0.95 } : {}}
                      key={idx}
                      onClick={() => handleSelect(opt)}
                      disabled={selectedOpt !== null}
                      className={`py-6 px-10 rounded-[24px] text-2xl sm:text-3xl font-display font-bold transition-all tracking-wide uppercase flex items-center justify-center gap-3 ${btnBg}`}
                    >
                      {opt}
                      {selectedOpt === opt && selectedOpt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() && (
                        <CheckCircle2 size={32} />
                      )}
                      {selectedOpt === opt && selectedOpt.trim().toLowerCase() !== q.correctAnswer.trim().toLowerCase() && (
                        <XCircle size={32} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sm:hidden mt-6 mb-4 z-10 w-full flex justify-center">
        {timerComponent}
      </div>
    </div>
  );
}
