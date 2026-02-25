import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CustomCursor = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleCursorLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseleave', handleCursorLeave);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseleave', handleCursorLeave);

      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - isVisible, cursorX, cursorY are stable

  // Don't show on touch devices OR if user prefers reduced motion
  if (
    (typeof window !== 'undefined' && 'ontouchstart' in window) ||
    prefersReducedMotion
  ) {
    return null;
  }

  return (
    <>
      {/* Outer cursor ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-teal pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Inner cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-teal pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

export default CustomCursor;
