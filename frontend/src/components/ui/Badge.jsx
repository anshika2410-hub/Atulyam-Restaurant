import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  className = '',
}) => {
  const base = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    brand: 'bg-brand-500/10 text-brand-400 border border-brand-500/30',
    gold: 'bg-gold-500/10 text-gold-400 border border-gold-500/30',
    veg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    nonVeg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    muted: 'bg-dark-800 text-[#A1A1AA] border border-dark-700',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wider uppercase',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], sizes[size], className))}>
      {children}
    </span>
  );
};

export default Badge;
