import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameProps } from '../types';
import { useAudio } from '../components/AudioProvider';
import { useScore } from '../components/ScoreProvider';
import Timer from '../components/Timer';
import confetti from 'canvas-confetti';

// --- CSS/SVG Shapes ---
const ShapeIcon = ({ shape, className = '' }: { shape: string, className?: string }) => {
  if (shape === 'Cubo') return <div className={`w-16 h-16 bg-blue-400 border-4 border-blue-600 shadow-[4px_4px_0_rgba(37,99,235,1)] ${className}`} />;
  if (shape === 'Esfera') return <div className={`w-16 h-16 bg-red-400 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#fca5a5,_#ef4444)] shadow-md ${className}`} />;
  if (shape === 'Cilindro') return (
    <div className={`relative w-12 h-16 bg-green-400 rounded-[10px]/[20px] shadow-md flex flex-col items-center border-[2px] border-green-600 ${className}`}>
        <div className="absolute top-[-10px] w-full h-5 bg-green-300 rounded-[50%] border-2 border-green-600"></div>
    </div>
  );
  if (shape === 'Cono') return (
    <div className={`w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-yellow-400 relative drop-shadow-md ${className}`}>
        <div className="absolute top-[50px] -left-[30px] w-[60px] h-4 bg-yellow-400 rounded-[50%]"></div>
    </div>
  );
  if (shape === 'Pirámide') return (
    <div className={`w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-orange-500 drop-shadow-md relative ${className}`}>
        <div className="absolute top-0 -left-[30px] w-[30px] h-[60px] border-r-[30px] border-r-transparent border-b-[60px] border-b-orange-400 opacity-60 mix-blend-multiply"></div>
    </div>
  );
  return null;
};

// Data models
const shapesList = ['Cubo', 'Esfera', 'Cilindro', 'Cono', 'Pirámide'];
const objectMap: Record<string, { emoji: string, name: string }[]> = {
  'Cubo': [{ emoji: '🎲', name: 'Dado' }, { emoji: '🎁', name: 'Regalo' }, { emoji: '🧊', name: 'Hielo' }],
  'Esfera': [{ emoji: '⚽', name: 'Balón' }, { emoji: '🌍', name: 'Mundo' }, { emoji: '🍊', name: 'Naranja' }],
  'Cilindro': [{ emoji: '🥫', name: 'Lata' }, { emoji: '🛢️', name: 'Bote' }, { emoji: '🔋', name: 'Pila' }],
  'Cono': [{ emoji: '🍦', name: 'Helado' }, { emoji: '🥳', name: 'Gorro' }, { emoji: '🌲', name: 'Pino' }],
  'Pirámide': [{ emoji: '🛕', name: 'Templo' }, { emoji: '⛺', name: 'Tienda' }],
};

export default function ShapesGame({ onComplete, onExit }: GameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameMode, setGameMode] = useState<"findShape" | "matchObject">("findShape");
  const { playSfx, speak } = useAudio();
  const { addScore } = useScore();

  // Mode 1: Find Shape specific state
  const [targetShape, setTargetShape] = useState('');
  const [gridItems, setGridItems] = useState<{shape: string, id: number, selected: boolean}[]>([]);

  // Mode 2: Match specific state
  const [targetObject, setTargetObject] = useState<{emoji: string, shape: string}>({emoji: '', shape: ''});
  const [options, setOptions] = useState<string[]>([]);

  const setupRound = () => {
    const isFindShapeMode = Math.random() > 0.5;
    setGameMode(isFindShapeMode ? "findShape" : "matchObject");

    if (isFindShapeMode) {
      const target = shapesList[Math.floor(Math.random() * shapesList.length)];
      setTargetShape(target);
      const newGrid = [];
      // 2 correct targets, 4 wrong targets
      for (let i = 0; i < 6; i++) {
        if (i < 2) {
          newGrid.push({ shape: target, id: i, selected: false });
        } else {
          let wrongShape = shapesList[Math.floor(Math.random() * shapesList.length)];
          while(wrongShape === target) {
             wrongShape = shapesList[Math.floor(Math.random() * shapesList.length)];
          }
          newGrid.push({ shape: wrongShape, id: i, selected: false });
        }
      }
      setGridItems(newGrid.sort(() => Math.random() - 0.5));
      speak(`Encuentra todos los ${target}s`);
    } else {
      const targetS = shapesList[Math.floor(Math.random() * shapesList.length)];
      const objList = objectMap[targetS];
      const obj = objList[Math.floor(Math.random() * objList.length)];
      setTargetObject({ emoji: obj.emoji, shape: targetS });
      
      const opts = [targetS];
      while(opts.length < 3) {
        const randS = shapesList[Math.floor(Math.random() * shapesList.length)];
        if (!opts.includes(randS)) opts.push(randS);
      }
      setOptions(opts.sort(() => Math.random() - 0.5));
      speak(`¿Qué forma tiene este objeto?`);
    }
  };

  useEffect(() => {
    setupRound();
  }, [currentRound]);

  const handleTimeUp = () => {
    playSfx('timeout');
    addScore(-20);
    nextRound();
  };

  const nextRound = () => {
    setTimeout(() => {
      if (currentRound < 99) {
        setCurrentRound(prev => prev + 1);
      } else {
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.4 } });
        playSfx('win');
        onComplete();
      }
    }, 1500);
  };

  const handleGridClick = (index: number) => {
    if (gridItems[index].selected) return;

    const newItems = [...gridItems];
    newItems[index].selected = true;
    setGridItems(newItems);

    if (newItems[index].shape === targetShape) {
      playSfx('pop');
      addScore(25);
      // Check if both found
      const foundCount = newItems.filter(item => item.shape === targetShape && item.selected).length;
      if (foundCount === 2) {
        playSfx('correct');
        // lock grid
        setGridItems(newItems.map(i => ({...i, selected: i.shape === targetShape ? true : i.selected})));
        nextRound();
      }
    } else {
      playSfx('wrong');
      addScore(-10);
    }
  };

  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const handleMatchClick = (opt: string) => {
    if (selectedMatch) return;
    setSelectedMatch(opt);
    if (opt === targetObject.shape) {
      playSfx('correct');
      addScore(50);
      nextRound();
      setTimeout(() => setSelectedMatch(null), 1500);
    } else {
      playSfx('wrong');
      addScore(-20);
      setTimeout(() => setSelectedMatch(null), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3FAFC] p-4 sm:p-6 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none -ml-20 -mb-20"></div>

      <div className="w-full max-w-4xl flex justify-between items-center mb-6 z-10 px-2 sm:px-6">
         <button 
           onClick={onExit}
           className="w-12 h-12 sm:w-14 sm:h-14 bg-white border-[3px] border-[#c5f6fa] rounded-2xl shadow-[0_4px_0_#99e9f2] text-[#0c8599] hover:bg-[#e3fafc] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none shrink-0"
         >
           ✖
         </button>
         
         <div className="flex-1 mx-4 sm:mx-8 flex flex-col items-center">
           <div className="text-[#1098AD] font-display font-bold text-lg mb-1 tracking-wide uppercase">
              Ronda {currentRound + 1}/100
           </div>
           <div className="w-full relative h-6 bg-white border-[4px] border-[#c5f6fa] rounded-full overflow-hidden shadow-inner flex items-center">
             <motion.div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#3bc9db] to-[#15aabf] rounded-full" initial={{ width: 0 }} animate={{ width: `${((currentRound + 1) / 100) * 100}%` }} />
           </div>
         </div>
         
         <div className="scale-110 hidden sm:block">
           <Timer initialSeconds={30} onTimeUp={handleTimeUp} resetKey={currentRound} />
         </div>
      </div>

      <motion.div 
        key={currentRound}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-white rounded-[40px] border-[6px] border-white flex flex-col items-center justify-center text-center relative z-10 px-6 pb-12 pt-16 shadow-[0_16px_0_rgba(21,170,191,0.3)] mt-8"
      >
        {gameMode === "findShape" ? (
          <>
            <div className="bg-[#15AABF] text-white px-8 py-3 rounded-full text-2xl font-display font-bold shadow-[0_6px_0_#0B7285] -mt-24 mb-10 border-4 border-white">
              Toca todos los {targetShape}s
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 mt-4 w-full px-4">
              {gridItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGridClick(idx)}
                  className={`aspect-square rounded-3xl flex items-center justify-center cursor-pointer border-4 transition-all ${item.selected ? (item.shape === targetShape ? 'bg-green-100 border-green-500 opacity-60' : 'bg-red-100 border-red-500 opacity-40') : 'bg-slate-50 border-slate-200 hover:border-[#15AABF] hover:bg-cyan-50 shadow-sm'}`}
                >
                   <ShapeIcon shape={item.shape} className={item.selected ? 'scale-110' : 'scale-100'} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#15AABF] text-white px-8 py-3 rounded-full text-2xl font-display font-bold shadow-[0_6px_0_#0B7285] -mt-24 mb-6 border-4 border-white">
              ¿A qué forma se parece?
            </div>
            
            <div className="text-8xl mb-12 drop-shadow-md animate-bounce pt-4">
              {targetObject.emoji}
            </div>

            <div className="flex flex-wrap justify-center gap-6 w-full px-4">
              {options.map((opt, idx) => {
                 let bgClass = "bg-slate-50 border-slate-200 text-slate-700 shadow-[0_8px_0_#e2e8f0]";
                 if (selectedMatch === opt) {
                   if (opt === targetObject.shape) {
                     bgClass = "bg-green-100 border-green-400 text-green-700 shadow-[0_0px_0_#4ade80] translate-y-2";
                   } else {
                     bgClass = "bg-red-100 border-red-400 text-red-700 shadow-[0_0px_0_#f87171] translate-y-2";
                   }
                 } else if (selectedMatch && targetObject.shape === opt) {
                   bgClass = "bg-green-100 border-green-400 text-green-700 shadow-[0_8px_0_#4ade80]";
                 }

                 return (
                   <button
                     key={idx}
                     onClick={() => handleMatchClick(opt)}
                     disabled={selectedMatch !== null}
                     className={`flex flex-col items-center justify-center p-6 rounded-3xl border-4 min-w-[140px] transition-all hover:bg-cyan-50 ${bgClass}`}
                   >
                     <ShapeIcon shape={opt} className="mb-4 scale-75" />
                     <span className="font-display font-bold text-xl">{opt}</span>
                   </button>
                 );
              })}
            </div>
          </>
        )}

      </motion.div>

      <div className="sm:hidden mt-6 mb-4 z-10 w-full flex justify-center">
         <Timer initialSeconds={30} onTimeUp={handleTimeUp} resetKey={currentRound} />
      </div>
    </div>
  );
}
