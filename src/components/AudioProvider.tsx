import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ReactPlayer from "react-player";

const Player = ReactPlayer as any;

interface AudioContextType {
  musicVolume: number;
  sfxVolume: number;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  playSfx: (type: "correct" | "wrong" | "pop" | "win" | "timeout") => void;
  speak: (text: string) => void;
  stopSpeak: () => void;
  playMusic: () => void;
  isSpeaking: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [musicVolume, setMusicVolume] = useState(0.2);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const playMusic = () => {
    if (musicVolume > 0) {
      setIsPlayingMusic(true);
    }
  };

  useEffect(() => {
    // Warm up the TTS engine list of voices.
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // Use a robust way to unlock audio on first mount if possible, or wait for user interaction
    const unlockAudio = () => {
      if (musicVolume > 0) {
        setIsPlayingMusic(true);
      }
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []); // Only run once on mount

  useEffect(() => {
    if (musicVolume === 0) {
      setIsPlayingMusic(false);
    } else if (musicVolume > 0) {
      // Don't auto-start here unless user unlocks
    }
  }, [musicVolume]);

  const playSfx = (type: "correct" | "wrong" | "pop" | "win" | "timeout") => {
    if (sfxVolume <= 0) return;
    try {
      if (type === 'correct') {
         const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
         if (AudioContextClass) {
           const ctx = new AudioContextClass();
           const playTone = (freq: number, startTime: number, duration: number) => {
             const osc = ctx.createOscillator();
             const gain = ctx.createGain();
             osc.type = 'triangle';
             osc.connect(gain);
             gain.connect(ctx.destination);
             osc.frequency.value = freq;
             gain.gain.setValueAtTime(sfxVolume * 0.3, startTime);
             gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
             osc.start(startTime);
             osc.stop(startTime + duration);
           };
           const t = ctx.currentTime;
           playTone(523.25, t, 0.15);       // C5
           playTone(659.25, t + 0.1, 0.15); // E5
           playTone(783.99, t + 0.2, 0.4);  // G5
           return;
         }
      }

      let soundUrl = '';
      if (type === 'win') soundUrl = 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3';
      else if (type === 'wrong') soundUrl = 'https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3'; 
      else if (type === 'timeout') soundUrl = 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'; 
      else if (type === 'pop') soundUrl = 'https://assets.mixkit.co/active_storage/sfx/2996/2996-preview.mp3';

      if (soundUrl) {
        const audio = new Audio(soundUrl);
        audio.volume = sfxVolume;
        audio.play().catch(() => {});
        return;
      }
    } catch (e) {
      console.log("Audio disabled or failed", e);
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window && sfxVolume > 0) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 0.85; // Aún más despacio para comprensión de niños
      utterance.pitch = 1.1; // Tono natural, ligeramente agudo

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      const voices = window.speechSynthesis.getVoices();
      const esVoices = voices.filter((v) => v.lang.startsWith("es"));

      // Buscar voces de chicas o las de Google que son de mejor calidad
      const googleVoice = esVoices.find((v) => v.name.includes("Google"));
      const femaleVoice = esVoices.find(
        (v) =>
          v.name.includes("Helena") ||
          v.name.includes("Monica") ||
          v.name.includes("Paulina") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria") ||
          v.name.includes("Sabina") ||
          v.name.includes("Marimba"),
      );

      if (googleVoice) {
        utterance.voice = googleVoice;
      } else if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (esVoices.length > 0) {
        utterance.voice = esVoices[0];
      }

      utterance.volume = sfxVolume;
      // Small timeout to ensure cancel has happened
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  const stopSpeak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
      // On some browsers, a cancelled utterance doesn't fully flush unless you dispatch a dummy one
      try {
         const dummy = new SpeechSynthesisUtterance("");
         dummy.volume = 0;
         window.speechSynthesis.speak(dummy);
         setTimeout(() => window.speechSynthesis.cancel(), 10);
      } catch (e) {}
    }
    setIsSpeaking(false);
  };

  return (
    <AudioContext.Provider
      value={{
        musicVolume,
        sfxVolume,
        setMusicVolume,
        setSfxVolume,
        playSfx,
        speak,
        stopSpeak,
        playMusic,
        isSpeaking,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};
