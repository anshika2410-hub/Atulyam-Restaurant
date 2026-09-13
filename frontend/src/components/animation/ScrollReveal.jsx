import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 24,
  className = '',
  once = true,
  scale = 1,
  as: Component = 'div',
  ...props
}) => {
  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    fade: { x: 0, y: 0 },
  };

  const initialOffset = directions[direction] || directions.up;

  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        ...initialOffset,
        scale: scale !== 1 ? scale : 1,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth luxury cubic-bezier
      }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default ScrollReveal;
