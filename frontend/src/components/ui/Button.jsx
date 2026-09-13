import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'right',
  onClick,
  type = 'button',
  as: Component = 'button',
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium tracking-widest uppercase transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50 disabled:opacity-45 disabled:cursor-not-allowed select-none overflow-hidden';

  const variants = {
    // Primary CTA: Signature warm orange with subtle radiant glow
    primary:
      'bg-gradient-to-r from-brand-500 via-[#E8832E] to-brand-500 bg-[length:200%_auto] text-white shadow-glow hover:shadow-glow-lg border border-brand-400/40 rounded-full hover:border-brand-300/70',
    // Secondary: Deep obsidian glass with gold/amber hairline border & accent hover
    secondary:
      'bg-dark-800/90 hover:bg-dark-750 text-ivory-200 hover:text-white border border-white/10 hover:border-brand-500/40 rounded-full backdrop-blur-sm shadow-sm',
    // Outline: Transparent with warm amber border
    outline:
      'bg-transparent border border-brand-500/50 hover:border-brand-500 text-brand-400 hover:text-white hover:bg-brand-500/10 rounded-full',
    // Ghost: Minimalist text CTA with amber highlight
    ghost:
      'bg-transparent text-ivory-300 hover:text-brand-400 hover:bg-white/[0.04] rounded-lg',
    // Luxury Pill: Pure black with delicate golden rim
    luxury:
      'bg-[#0B0B0C] text-[#FDFBF7] border border-gold-500/40 hover:border-gold-400 rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
  };

  const sizes = {
    sm: 'text-[10px] px-4 py-2 gap-1.5',
    md: 'text-xs px-6 py-3 gap-2.5',
    lg: 'text-xs sm:text-sm px-8 py-3.5 sm:py-4 gap-3 font-semibold',
  };

  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      type={Component === 'button' ? type : undefined}
      disabled={disabled || loading}
      onClick={onClick}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
        </>
      )}
    </MotionComponent>
  );
};

export default Button;
