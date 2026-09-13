import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Container = ({
  children,
  className = '',
  size = 'default',
  as: Component = 'div',
  ...props
}) => {
  const sizes = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <Component
      className={twMerge(
        clsx(
          'w-full mx-auto px-4 sm:px-6 lg:px-8',
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
