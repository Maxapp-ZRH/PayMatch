/**
 * Language Transition Component
 *
 * Provides a smooth, animated transition when switching languages.
 * Features a splash screen with cool effects and loading animation.
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageTransitionProps {
  isTransitioning: boolean;
  fromLanguage: string;
  toLanguage: string;
  onComplete: () => void;
}

export function LanguageTransition({
  isTransitioning,
  fromLanguage,
  toLanguage,
  onComplete,
}: LanguageTransitionProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isTransitioning) return;

    // Animate progress from 0 to 100
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        // Complete the transition
        setTimeout(() => {
          onComplete();
          setProgress(0);
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [isTransitioning, onComplete]);

  if (!isTransitioning) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-100/20 to-blue-100/20 rounded-full"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-100/20 to-teal-100/20 rounded-full"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Language flags animation */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl"
            >
              {fromLanguage === 'en' ? '🇺🇸' : '🇨🇭'}
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-4xl text-teal-600"
            >
              →
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-6xl"
            >
              {toLanguage === 'en' ? '🇺🇸' : '🇨🇭'}
            </motion.div>
          </div>

          {/* Language names */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <div className="text-2xl font-semibold text-gray-800 mb-2">
              Switching to {toLanguage === 'en' ? 'English' : 'Deutsch'}
            </div>
            <div className="text-sm text-gray-600">
              {toLanguage === 'en'
                ? 'Switching to English...'
                : 'Wechseln zu Deutsch...'}
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-500 mt-2"
            >
              {Math.round(progress)}%
            </motion.div>
          </div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-1 mt-6"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-teal-500 rounded-full"
              />
            ))}
          </motion.div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
