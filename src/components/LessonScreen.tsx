import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, ArrowLeft, Play, Square } from 'lucide-react';
import { useAudio } from './AudioProvider';

interface LessonScreenProps {
  title: string;
  content: string;
  emoji: string;
  onStartGame: () => void;
  onExit: () => void;
  colorHex: string;
}

export default function LessonScreen({ title, content, emoji, onStartGame, onExit, colorHex }: LessonScreenProps) {
  const { speak, stopSpeak, playMusic, isSpeaking } = useAudio();

  useEffect(() => {
    return () => {
      stopSpeak();
    };
  }, [stopSpeak]);

  const handleSkipOrExit = (action: 'exit' | 'start') => {
    stopSpeak();
    if (action === 'start') {
      playMusic();
      onStartGame();
    } else {
      onExit();
    }
  };

  return (
    <div className="min-h-screen h-full w-full bg-[#f4fbfc] overflow-y-auto relative p-6">
      <div className="flex flex-col items-center min-h-full w-full py-8">
        {/* Decorative background blobs */}
        <div className="fixed top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>
        <div className="fixed bottom-0 left-0 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-60 pointer-events-none -ml-20 -mb-20"></div>

        <div className="w-full max-w-3xl flex justify-between items-center mb-24 z-10">
          <button 
            onClick={() => handleSkipOrExit('exit')}
            className="w-14 h-14 bg-white border-[3px] border-[#e6eef2] rounded-2xl shadow-[0_4px_0_#d1e0e8] text-[#A59580] hover:bg-[#F9F4F0] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none shrink-0"
          >
            <ArrowLeft size={32} />
          </button>

          <button 
            onClick={() => isSpeaking ? stopSpeak() : speak(content)}
            className="w-14 h-14 bg-white border-[3px] border-[#e6eef2] rounded-2xl shadow-[0_4px_0_#d1e0e8] text-[#A59580] hover:bg-[#F9F4F0] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none shrink-0"
            title={isSpeaking ? "Detener lectura" : "Leer en voz alta"}
          >
            {isSpeaking ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-3xl bg-white rounded-[40px] border-[6px] border-white flex flex-col items-center text-center relative z-10 px-8 pb-12 pt-16 shadow-[0_16px_0_rgba(0,0,0,0.05)] mt-12"
        >
        <div 
           style={{ backgroundColor: colorHex, boxShadow: `0 8px 0 ${colorHex}80` }}
           className="w-36 h-36 rounded-full flex items-center justify-center mb-6 absolute -top-20 border-[6px] border-white transform transition-transform hover:scale-110 hover:-rotate-6"
        >
          <span className="text-7xl">{emoji}</span>
        </div>
        
        <h2 style={{ color: colorHex }} className="text-5xl font-display font-bold mb-10 mt-6 tracking-wide drop-shadow-sm">{title}</h2>
        
        <div className="text-2xl font-bold text-[#4A4A4A] leading-relaxed mb-12 max-w-2xl px-4">
          {content.split('\n').map((line, i) => (
            <p key={i} className="mb-4">{line}</p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center px-4">
          {isSpeaking ? (
            <button 
              onClick={() => stopSpeak()}
              className="w-20 h-20 bg-gradient-to-br from-[#FFB3B3] to-[#FF4D4D] border-4 border-white rounded-[24px] shadow-[0_8px_0_#CC0000] text-white hover:scale-105 active:translate-y-2 active:shadow-none flex items-center justify-center transition-all shrink-0 mx-auto sm:mx-0"
            >
              <Square fill="currentColor" size={32} />
            </button>
          ) : (
            <button 
              onClick={() => speak(content)}
              className="w-20 h-20 bg-gradient-to-br from-[#FFF0B3] to-[#FFD700] border-4 border-white rounded-[24px] shadow-[0_8px_0_#DDAA00] text-[#8B7300] hover:scale-105 active:translate-y-2 active:shadow-none flex items-center justify-center transition-all shrink-0 mx-auto sm:mx-0"
            >
              <Volume2 size={40} className="fill-current" />
            </button>
          )}
          
          <button 
             onClick={() => handleSkipOrExit('start')}
             style={{ backgroundColor: colorHex, boxShadow: `0 8px 0 ${colorHex}AA` }}
             className="flex-1 max-w-sm py-5 text-white rounded-[24px] font-display font-bold text-3xl tracking-wide hover:scale-[1.02] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4 mx-auto sm:mx-0 border-4 border-white"
          >
             <Play fill="currentColor" size={32} /> ¡A JUGAR!
          </button>
        </div>

        <button 
          onClick={() => handleSkipOrExit('start')}
          className="mt-6 text-gray-400 font-bold tracking-wide hover:text-gray-600 transition-colors underline underline-offset-4 decoration-2"
        >
          Omitir lección y pasar a las preguntas
        </button>
      </motion.div>
      </div>
    </div>
  );
}
