import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, X, Music } from 'lucide-react';
import { useAudio } from './AudioProvider';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume, playSfx } = useAudio();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white p-8 rounded-[40px] shadow-[0_16px_0_rgba(0,0,0,0.1)] border-[6px] border-[#e6eef2] max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 border-[4px] border-[#e6eef2] shadow-sm transform transition-transform hover:scale-110 active:scale-95"
            >
              <X size={28} strokeWidth={3} />
            </button>
            
            <h2 className="text-4xl font-display font-bold text-[#4A4A4A] mb-8 text-center text-purple-600">Ajustes</h2>

            <div className="space-y-8 bg-[#f4fbfc] p-6 rounded-[24px] border-4 border-white shadow-inner">
              <div>
                 <div className="flex items-center gap-3 mb-4 text-[#A59580]">
                    <div className="bg-pink-100 p-2 rounded-xl text-pink-500">
                      <Music size={24} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-display font-bold uppercase tracking-wider text-slate-600">Música de Fondo</h3>
                 </div>
                 <div className="flex items-center gap-4 bg-white p-4 rounded-full border-2 border-[#e6eef2]">
                    <VolumeX size={24} className={musicVolume === 0 ? 'text-pink-500' : 'text-slate-300'} />
                    <input 
                      type="range" 
                      min="0" max="1" step="0.05"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      className="flex-1 h-4 bg-[#e6eef2] rounded-full appearance-none accent-[#FF85A1]"
                    />
                    <Volume2 size={24} className={musicVolume > 0 ? 'text-pink-500' : 'text-slate-300'} />
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-3 mb-4 text-[#A59580]">
                    <div className="bg-cyan-100 p-2 rounded-xl text-cyan-500">
                      <Volume2 size={24} strokeWidth={3} />
                    </div>
                    <h3 className="text-xl font-display font-bold uppercase tracking-wider text-slate-600">Efectos (Sonidos)</h3>
                 </div>
                 <div className="flex items-center gap-4 bg-white p-4 rounded-full border-2 border-[#e6eef2]">
                    <VolumeX size={24} className={sfxVolume === 0 ? 'text-cyan-500' : 'text-slate-300'} />
                    <input 
                      type="range" 
                      min="0" max="1" step="0.05"
                      value={sfxVolume}
                      onChange={(e) => {
                        setSfxVolume(parseFloat(e.target.value));
                      }}
                      onMouseUp={() => playSfx('pop')}
                      onTouchEnd={() => playSfx('pop')}
                      className="flex-1 h-4 bg-[#e6eef2] rounded-full appearance-none accent-cyan-400"
                    />
                    <Volume2 size={24} className={sfxVolume > 0 ? 'text-cyan-500' : 'text-slate-300'} />
                 </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-8 w-full py-4 bg-purple-500 text-white rounded-[20px] font-display font-bold text-2xl uppercase tracking-wide border-4 border-purple-400 shadow-[0_6px_0_theme(colors.purple.600)] hover:brightness-110 active:translate-y-2 active:shadow-none transition-all"
            >
              ¡Vale!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
