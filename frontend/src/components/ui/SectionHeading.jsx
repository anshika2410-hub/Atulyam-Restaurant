import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const SectionHeading = ({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  className = '',
  divider = true,
  animate = true,
}) => {
  const alignmentClasses = {
    center: 'text-center mx-auto items-center',
    left: 'text-left items-start',
  };

  const content = (
    <div className={twMerge(clsx('flex flex-col max-w-3xl', alignmentClasses[align], className))}>
      {/* Eyebrow / Kicker */}
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-brand-500 text-xs select-none">✦</span>
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest-xl text-brand-400">
            {eyebrow}
          </span>
          <span className="text-brand-500 text-xs select-none">✦</span>
        </div>
      )}

      {/* Main Title */}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ivory-100 font-normal leading-[1.12] tracking-tight mb-4">
        {title}{' '}
        {highlight && (
          <span className="italic font-light text-amber-gradient block sm:inline">
            {highlight}
          </span>
        )}
      </h2>

      {/* Subtle Divider */}
      {divider && (
        <div
          className={twMerge(
            clsx(
              'flex items-center gap-3 my-4 w-28',
              align === 'center' ? 'mx-auto' : ''
            )
          )}
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-brand-500/40" />
          <span className="w-1.5 h-1.5 rotate-45 bg-brand-500 rounded-[1px] shadow-[0_0_8px_rgba(224,122,36,0.6)]" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-brand-500/40" />
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm sm:text-base text-ivory-400 font-light leading-relaxed max-w-2xl mt-1">
          {description}
        </p>
      )}
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {content}
    </motion.div>
  );
};

export default SectionHeading;
