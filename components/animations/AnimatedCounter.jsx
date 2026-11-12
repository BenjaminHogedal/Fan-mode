'use client';
import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
export default function AnimatedCounter({ value, duration = 1.5, onComplete }) {
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const animation = animate(0, value, { duration: reduced ? 0 : duration, ease: 'easeOut', onUpdate: v => setDisplay(Math.round(v)), onComplete });
    return () => animation.stop();
  }, [value, duration, reduced, onComplete]);
  return <span>{display}</span>;
}
