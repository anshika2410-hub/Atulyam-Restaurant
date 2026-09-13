import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ImageReveal = ({
  src,
  alt = 'Atulyam Fine Dining',
  aspectRatio = 'aspect-[4/3]',
  className = '',
  overlay = true,
  caption,
  badge,
  hoverZoom = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={twMerge(
        clsx(
          'relative overflow-hidden rounded-2xl bg-dark-850 border border-white/5 group select-none',
          aspectRatio,
          className
        )
      )}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850 animate-pulse" />
      )}

      {/* Main Image */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={twMerge(
          clsx(
            'w-full h-full object-cover transition-transform duration-700 ease-out',
            hoverZoom ? 'group-hover:scale-105' : ''
          )
        )}
      />

      {/* Ambient Gradient Overlay for Cinematic Depth */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/25 to-transparent opacity-75 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* Optional Badge */}
      {badge && (
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold bg-dark-950/80 backdrop-blur-md border border-brand-500/30 text-brand-400">
            {badge}
          </span>
        </div>
      )}

      {/* Optional Caption */}
      {caption && (
        <div className="absolute bottom-3.5 left-4 right-4 z-10">
          <p className="font-serif text-sm sm:text-base text-ivory-100 font-medium line-clamp-1 drop-shadow-md">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageReveal;
