import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isVisible: boolean;
}

export default function CorrectAnimation({ isVisible }: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{
            opacity: 0,
            scale: 1.5,
            filter: "blur(10px)",
            transition: { duration: 0.2 },
          }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-20 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-full blur-3xl opacity-50"
            />
            <div className="text-9xl drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)]">
              🌟
            </div>
            <motion.div
              animate={{ y: 20 }}
              initial={{ y: -10 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute -top-10 -right-10 text-6xl drop-shadow-md"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ y: -20 }}
              initial={{ y: 10 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-10 text-7xl drop-shadow-md"
            >
              💖
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
