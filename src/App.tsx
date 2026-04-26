import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Music, Music2 } from 'lucide-react';
import SizeGame from './games/SizeGame';
import AntonymsGame from './games/AntonymsGame';
import VerbsGame from './games/VerbsGame';
import QuizGame from './games/QuizGame';
import MathGame from './games/MathGame';
import ShapesGame from './games/ShapesGame';
import { shapesData, calendarData, additionData, subtractionData } from './data/mathData';
import { AudioProvider, useAudio } from './components/AudioProvider';
import SettingsModal from './components/SettingsModal';
import LessonScreen from './components/LessonScreen';

type GameState = 'home' | 'lesson_sizes' | 'sizes' | 'lesson_antonyms' | 'antonyms' | 'lesson_verbs' | 'verbs' | 'lesson_shapes' | 'shapes' | 'lesson_calendar' | 'calendar' | 'lesson_addition' | 'addition' | 'lesson_subtraction' | 'subtraction';

import { ScoreProvider, useScore } from './components/ScoreProvider';

// Wrap the app contents so we can use the useAudio hook inside
function AppContent() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [showSettings, setShowSettings] = useState(false);
  const { musicVolume, setMusicVolume, playMusic, playSfx } = useAudio();
  const { score } = useScore();

  const toggleMusic = () => {
    if (musicVolume === 0) {
      setMusicVolume(0.3);
      setTimeout(playMusic, 50); // wait slightly for state trigger
    } else {
      setMusicVolume(0);
    }
  };

  const handleLevelClick = (targetState: GameState) => {
    playMusic();
    playSfx('pop');
    setGameState(targetState);
  };

  const goToHome = () => setGameState('home');
  const onCompleteGame = () => setGameState('home');

  return (
    <div className="w-full h-screen min-h-screen bg-[#FFF8F0] text-[#4A4A4A] font-sans flex flex-col overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {gameState === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full bg-[#f4fbfc] overflow-x-hidden relative"
            onClick={() => {}}
          >
            {/* Playful Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-60"></div>

            {/* Header Navigation */}
            <header className="h-24 shrink-0 px-6 sm:px-10 flex items-center justify-between bg-white border-b-[6px] border-[#e6eef2] z-10 relative shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF85A1] to-[#FF5C81] rounded-2xl flex items-center justify-center shadow-[0_4px_0_#D6336C] transform -rotate-3 border-2 border-white">
                  <span className="text-white text-3xl">👧</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#FF5C81] tracking-tight drop-shadow-sm">Aventura de Aprender</h1>
                  <div className="bg-[#FFF0B3] px-3 py-1 rounded-full border-2 border-[#F0D560] inline-block mt-1">
                    <p className="text-[10px] sm:text-xs font-black text-[#8B7300] uppercase tracking-wider">Nivel 1 • Primaria</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-5">
                <div className="hidden md:flex bg-gradient-to-r from-[#FFF3BF] to-[#FFF0B3] px-6 py-2.5 rounded-full border-[3px] border-[#FFE066] items-center gap-2 shadow-[0_4px_0_#E6B300]">
                  <span className="text-2xl animate-bounce">⭐</span>
                  <span className="font-display font-bold text-[#8B7300] text-lg">{score} PTS</span>
                </div>
                <button 
                  onClick={toggleMusic}
                  className="w-12 h-12 bg-cyan-100 hover:bg-cyan-200 transition-colors rounded-2xl flex items-center justify-center border-2 border-cyan-300 shadow-[0_4px_0_theme(colors.cyan.400)] active:translate-y-1 active:shadow-none"
                >
                  {musicVolume > 0 ? <Music size={24} className="text-cyan-600" /> : <Music2 size={24} className="text-cyan-400 opacity-50" />}
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-12 h-12 bg-purple-100 hover:bg-purple-200 transition-colors rounded-2xl flex items-center justify-center border-2 border-purple-300 shadow-[0_4px_0_theme(colors.purple.400)] active:translate-y-1 active:shadow-none"
                >
                  <Settings size={28} className="text-purple-600" />
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 sm:p-10 z-10">
              <div className="flex flex-col items-center justify-start w-full min-h-full">
                <motion.h2 
                   initial={{ y: -20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="font-display text-4xl text-[#4A4A4A] mb-10 text-center max-w-lg"
                >
                  ¿Qué vamos a aprender <span className="text-[#9D4EDD]">hoy?</span>
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
                <div className="col-span-full mb-2">
                  <h3 className="text-2xl font-display font-bold text-[#D6336C]">Lengua</h3>
                  <div className="h-1 w-20 bg-[#FF85A1] rounded-full mt-2"></div>
                </div>

                {/* Card 1 */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick('lesson_sizes')}
                  className="group bg-gradient-to-b from-[#FFE3ED] to-[#FFC2D8] rounded-[40px] border-[6px] border-white p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-[0_12px_0_#FF85A1] hover:shadow-[0_4px_0_#FF85A1] hover:translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg -mr-10 -mt-10"></div>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-[#FF85A1] transform transition-transform group-hover:scale-110">
                    <span className="text-6xl animate-pulse">🐭</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#D6336C] mb-2 leading-none uppercase">
                    Tamaño
                  </h2>
                  <p className="text-[#B04A6E] font-bold text-lg">Diminutivos y Aumentativos</p>
                  <div className="mt-8 bg-white px-8 py-3 rounded-full text-[#D6336C] font-display font-bold text-xl uppercase shadow-sm">¡A Jugar!</div>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick('lesson_antonyms')}
                  className="group bg-gradient-to-b from-[#D3F9D8] to-[#9CD9A9] rounded-[40px] border-[6px] border-white p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-[0_12px_0_#40C057] hover:shadow-[0_4px_0_#40C057] hover:translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg -mr-10 -mt-10"></div>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-[#40C057] transform transition-transform group-hover:scale-110">
                    <span className="text-6xl animate-pulse">🌓</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#2B8A3E] mb-2 leading-none uppercase">
                    Antónimos
                  </h2>
                  <p className="text-[#2F7E43] font-bold text-lg">Todo lo contrario...</p>
                  <div className="mt-8 bg-white px-8 py-3 rounded-full text-[#2B8A3E] font-display font-bold text-xl uppercase shadow-sm">¡A Jugar!</div>
                </motion.div>

                {/* Card 3 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick('lesson_verbs')}
                  className="group bg-gradient-to-b from-[#FFF5C3] to-[#FFE066] rounded-[40px] border-[6px] border-white p-8 flex flex-col items-center justify-center text-center cursor-pointer sm:col-span-2 lg:col-span-1 transition-all shadow-[0_12px_0_#FAB005] hover:shadow-[0_4px_0_#FAB005] hover:translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg -mr-10 -mt-10"></div>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-[#FAB005] transform transition-transform group-hover:scale-110">
                    <span className="text-6xl animate-pulse">⏳</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#E67700] mb-2 leading-none uppercase">
                    Verbos
                  </h2>
                  <p className="text-[#C76F14] font-bold text-lg">Pasado, presente y futuro</p>
                  <div className="mt-8 bg-white px-8 py-3 rounded-full text-[#E67700] font-display font-bold text-xl uppercase shadow-sm">¡A Jugar!</div>
                </motion.div>

                <div className="col-span-full mt-8 mb-2">
                  <h3 className="text-2xl font-display font-bold text-[#0CA678]">Matemáticas</h3>
                  <div className="h-1 w-20 bg-[#20C997] rounded-full mt-2"></div>
                </div>

                {/* Math Card 1: Shapes */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick('lesson_shapes')}
                  className="group bg-gradient-to-b from-[#E3FAFC] to-[#99E9F2] rounded-[40px] border-[6px] border-white p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-[0_12px_0_#15AABF] hover:shadow-[0_4px_0_#15AABF] hover:translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg -mr-10 -mt-10"></div>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-[#15AABF] transform transition-transform group-hover:scale-110">
                    <span className="text-6xl animate-pulse">📦</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#0B7285] mb-2 leading-none uppercase">
                    Cuerpos
                  </h2>
                  <p className="text-[#1098AD] font-bold text-lg">Geométricos</p>
                  <div className="mt-8 bg-white px-8 py-3 rounded-full text-[#0B7285] font-display font-bold text-xl uppercase shadow-sm">¡A Jugar!</div>
                </motion.div>

                {/* Math Card 2: Calendar */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick('lesson_calendar')}
                  className="group bg-gradient-to-b from-[#F3F0FF] to-[#D0BFFF] rounded-[40px] border-[6px] border-white p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-[0_12px_0_#845EF7] hover:shadow-[0_4px_0_#845EF7] hover:translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg -mr-10 -mt-10"></div>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-[#845EF7] transform transition-transform group-hover:scale-110">
                    <span className="text-6xl animate-pulse">📅</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#5F3DC4] mb-2 leading-none uppercase">
                    Calendario
                  </h2>
                  <p className="text-[#6741D9] font-bold text-lg">Días y meses</p>
                  <div className="mt-8 bg-white px-8 py-3 rounded-full text-[#5F3DC4] font-display font-bold text-xl uppercase shadow-sm">¡A Jugar!</div>
                </motion.div>

                {/* Math Card 3: Addition */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick('lesson_addition')}
                  className="group bg-gradient-to-b from-[#FFF0F6] to-[#FCC2D7] rounded-[40px] border-[6px] border-white p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-[0_12px_0_#F06595] hover:shadow-[0_4px_0_#F06595] hover:translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg -mr-10 -mt-10"></div>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-[#F06595] transform transition-transform group-hover:scale-110">
                    <span className="text-6xl animate-pulse">➕</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#A61E4D] mb-2 leading-none uppercase">
                    Sumas
                  </h2>
                  <p className="text-[#C2255C] font-bold text-lg">Juntar números</p>
                  <div className="mt-8 bg-white px-8 py-3 rounded-full text-[#A61E4D] font-display font-bold text-xl uppercase shadow-sm">¡A Jugar!</div>
                </motion.div>

                 {/* Math Card 4: Subtraction */}
                 <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLevelClick('lesson_subtraction')}
                  className="group bg-gradient-to-b from-[#E8FDF5] to-[#A9EEC2] rounded-[40px] border-[6px] border-white p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-[0_12px_0_#20C997] hover:shadow-[0_4px_0_#20C997] hover:translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg -mr-10 -mt-10"></div>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-[#20C997] transform transition-transform group-hover:scale-110">
                    <span className="text-6xl animate-pulse">➖</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#087F5B] mb-2 leading-none uppercase">
                    Restas
                  </h2>
                  <p className="text-[#099268] font-bold text-lg">Quitar números</p>
                  <div className="mt-8 bg-white px-8 py-3 rounded-full text-[#087F5B] font-display font-bold text-xl uppercase shadow-sm">¡A Jugar!</div>
                </motion.div>

                {/* Gamification Rewards Section */}
                <div className="col-span-full mt-12 mb-4 bg-white/60 p-8 rounded-[40px] border-[4px] border-dashed border-[#e6eef2] shadow-sm">
                  <h3 className="text-3xl font-display font-bold text-[#4A4A4A] mb-8 text-center flex items-center justify-center gap-3">
                    <span className="text-4xl">🏆</span> Tus Recompensas Estelares <span className="text-4xl">🏆</span>
                  </h3>
                  <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8 gap-y-12 pt-4">
                    {[
                      { scoreReq: 100, emoji: '🌟', label: 'Estrellita' },
                      { scoreReq: 500, emoji: '🎈', label: 'Globo Feliz' },
                      { scoreReq: 1000, emoji: '🦄', label: 'Unicornio' },
                      { scoreReq: 2000, emoji: '👑', label: 'Corona VIP' },
                      { scoreReq: 5000, emoji: '🚀', label: 'Super Cohete' },
                    ].map((reward) => {
                      const isUnlocked = score >= reward.scoreReq;
                      return (
                        <div key={reward.scoreReq} className={`flex flex-col items-center p-5 rounded-[32px] w-36 transition-all duration-500 ${isUnlocked ? 'bg-gradient-to-br from-yellow-100 to-yellow-300 border-[4px] border-yellow-400 shadow-[0_8px_0_#F59E0B] sm:scale-110 -translate-y-4' : 'bg-gray-100 border-[4px] border-gray-200'}`}>
                          <div className={`text-6xl mb-4 ${isUnlocked ? 'animate-bounce drop-shadow-md' : 'grayscale opacity-40'}`}>
                            {isUnlocked ? reward.emoji : '🔒'}
                          </div>
                          <span className={`font-bold font-display text-center leading-tight mb-2 ${isUnlocked ? 'text-yellow-800' : 'text-gray-400'}`}>
                            {reward.label}
                          </span>
                          <div className={`text-xs font-black px-3 py-1 rounded-full ${isUnlocked ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-500'}`}>
                            {reward.scoreReq} pts
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
              </div>
            </main>

          </motion.div>
        )}

        {gameState === 'lesson_sizes' && (
          <motion.div key="lesson_sizes" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full overflow-y-auto">
            <LessonScreen 
              title="Diminutivos y Aumentativos" 
              emoji="🐭"
              colorHex="#D6336C"
              content={"¡Hola!\n\nHoy vamos a aprender a hacer las cosas muy grandes o muy pequeñas.\n\nPara hacer algo pequeño (diminutivo) usamos -ito o -ita. Por ejemplo: de perro, ¡perrito!\n\nPara hacer algo grande (aumentativo) usamos -azo, -aza, -ón o -ona. Por ejemplo: de perro, ¡perrazo!\n\n¿Estás lista para jugar?"}
              onStartGame={() => setGameState('sizes')}
              onExit={() => setGameState('home')}
            />
          </motion.div>
        )}

        {gameState === 'sizes' && <SizeGame key="sizes" onComplete={onCompleteGame} onExit={goToHome} />}

        {gameState === 'lesson_antonyms' && (
          <motion.div key="lesson_antonyms" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full overflow-y-auto">
            <LessonScreen 
              title="Antónimos" 
              emoji="🌓"
              colorHex="#2B8A3E"
              content={"¡Hola!\n\nHoy vamos a aprender sobre los antónimos.\n\nLos antónimos son palabras que significan exactamente lo contrario que otra palabra.\n\nPor ejemplo: el contrario de 'Día' es 'Noche'. El contrario de 'Feliz' es 'Triste'.\n\n¡Vamos a ver cuántos contrarios conoces!"}
              onStartGame={() => setGameState('antonyms')}
              onExit={() => setGameState('home')}
            />
          </motion.div>
        )}

        {gameState === 'antonyms' && <AntonymsGame key="antonyms" onComplete={onCompleteGame} onExit={goToHome} />}

        {gameState === 'lesson_verbs' && (
          <motion.div key="lesson_verbs" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full overflow-y-auto">
            <LessonScreen 
              title="Tiempos Verbales" 
              emoji="⏳"
              colorHex="#E67700"
              content={"¡Hola!\n\nHoy vamos a viajar en el tiempo con los verbos.\n\nLos verbos son acciones, como 'saltar' o 'comer'.\n\nPodemos hacer acciones en el Pasado (Ayer salté), en el Presente (Hoy salto) y en el Futuro (Mañana saltaré).\n\n¡Elige el verbo correcto para viajar en el tiempo!"}
              onStartGame={() => setGameState('verbs')}
              onExit={() => setGameState('home')}
            />
          </motion.div>
        )}

        {gameState === 'verbs' && <VerbsGame key="verbs" onComplete={onCompleteGame} onExit={goToHome} />}

        {gameState === 'lesson_shapes' && (
          <motion.div key="lesson_shapes" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full overflow-y-auto">
            <LessonScreen 
              title="Cuerpos Geométricos" 
              emoji="📦"
              colorHex="#0B7285"
              content={"¡Hola!\n\nHoy vamos a aprender sobre los cuerpos geométricos.\n\nSon figuras que ocupan un lugar en el espacio. Algunos ejemplos son:\n- El Cubo: como un dado.\n- El Cilindro: como una lata o un vaso.\n- El Cono: como el cucurucho de un helado.\n- La Pirámide: como las pirámides de Egipto.\n\n¿Estás lista para identificarlos?"}
              onStartGame={() => setGameState('shapes')}
              onExit={() => setGameState('home')}
            />
          </motion.div>
        )}
        {gameState === 'shapes' && <ShapesGame key="shapes" onComplete={onCompleteGame} onExit={goToHome} />}

        {gameState === 'lesson_calendar' && (
          <motion.div key="lesson_calendar" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full overflow-y-auto">
            <LessonScreen 
              title="El Calendario" 
              emoji="📅"
              colorHex="#5F3DC4"
              content={"¡Hola!\n\nAprenderemos sobre el Calendario.\n\nUn año tiene 12 meses: Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre.\n\nUna semana tiene 7 días: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado y Domingo.\n\n¡Vamos a practicar juntas!"}
              onStartGame={() => setGameState('calendar')}
              onExit={() => setGameState('home')}
            />
          </motion.div>
        )}
        {gameState === 'calendar' && <QuizGame key="calendar" questions={calendarData} onComplete={onCompleteGame} onExit={goToHome} theme={{bgFrom: 'from-[#F3F0FF]', bgTo: 'to-[#D0BFFF]', borderColor: 'border-[#845EF7]', textColor: 'text-[#5F3DC4]', accentColor: '#845EF7', shadowColor: 'shadow-[0_16px_0_rgba(132,94,247,0.3)]'}} />}

        {gameState === 'lesson_addition' && (
          <motion.div key="lesson_addition" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full overflow-y-auto">
            <LessonScreen 
              title="Sumas" 
              emoji="➕"
              colorHex="#A61E4D"
              content={"¡Hola!\n\nHoy vamos a practicar las Sumas.\n\nSumar significa juntar dos cantidades para saber cuántas tenemos en total.\n\nA veces vas a tener que \"llevar\" números si la suma pasa de 9, y otras veces no será necesario.\n\n¡Cuenta con atención y suma los números!"}
              onStartGame={() => setGameState('addition')}
              onExit={() => setGameState('home')}
            />
          </motion.div>
        )}
        {gameState === 'addition' && <MathGame key="addition" questions={additionData} onComplete={onCompleteGame} onExit={goToHome} theme={{bgFrom: 'from-[#FFF0F6]', bgTo: 'to-[#FCC2D7]', borderColor: 'border-[#F06595]', textColor: 'text-[#A61E4D]', accentColor: '#F06595', shadowColor: 'shadow-[0_16px_0_rgba(240,101,149,0.3)]'}} />}

        {gameState === 'lesson_subtraction' && (
          <motion.div key="lesson_subtraction" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full overflow-y-auto">
            <LessonScreen 
              title="Restas" 
              emoji="➖"
              colorHex="#087F5B"
              content={"¡Hola!\n\nLlegó el turno de las Restas.\n\nRestar significa quitarle una cantidad a otra más grande para saber cuánto nos sobra.\n\nEstas restas las haremos \"sin llevadas\" para que empieces a practicar a quitar poquito a poco.\n\n¡Concéntrate para encontrar la cantidad correcta!"}
              onStartGame={() => setGameState('subtraction')}
              onExit={() => setGameState('home')}
            />
          </motion.div>
        )}
        {gameState === 'subtraction' && <MathGame key="subtraction" questions={subtractionData} onComplete={onCompleteGame} onExit={goToHome} theme={{bgFrom: 'from-[#E8FDF5]', bgTo: 'to-[#A9EEC2]', borderColor: 'border-[#20C997]', textColor: 'text-[#087F5B]', accentColor: '#20C997', shadowColor: 'shadow-[0_16px_0_rgba(32,201,151,0.3)]'}} />}
      </AnimatePresence>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ScoreProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </ScoreProvider>
  );
}
