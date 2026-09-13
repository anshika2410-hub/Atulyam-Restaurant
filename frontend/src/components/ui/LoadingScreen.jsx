import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

export const LoadingScreen = ({
  fullScreen = true,
  message = 'Crafting Epicurean Excellence...',
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0C]'
    : 'w-full py-20 flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      {/* Subtle radial amber background */}
      <div className="absolute w-72 h-72 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Brand Emblem */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 15px rgba(224, 122, 36, 0.2)',
              '0 0 35px rgba(224, 122, 36, 0.45)',
              '0 0 15px rgba(224, 122, 36, 0.2)',
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-dark-850 border border-brand-500/40 flex items-center justify-center mb-6"
        >
          <UtensilsCrossed className="w-7 h-7 text-brand-500" />
        </motion.div>

        {/* Wordmark */}
        <h2 className="font-serif text-2xl tracking-[0.25em] uppercase text-ivory-100 font-semibold mb-2">
          Atulyam
        </h2>

        {/* Dynamic Loading Message */}
        <p className="text-xs uppercase tracking-widest-xl text-ivory-400 font-light max-w-xs">
          {message}
        </p>

        {/* Elegant Linear Progress Bar */}
        <div className="w-36 h-[2px] bg-dark-800 rounded-full overflow-hidden mt-6">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-brand-500 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
