'use client';
import { useEffect, useRef } from 'react';
import { useFanModus } from '@/context/FanModusContext';

// Animation dwell times and visible clocks share the same demo time jumps.
export default function useSessionTimeout(callback, duration, enabled) {
  const { session } = useFanModus();
  const offset = session.demoTimeOffsetMs ?? 0;
  const deadline = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const now = Date.now() + offset;
    if (deadline.current === null) deadline.current = now + duration;
    const timer = setTimeout(callback, Math.max(0, deadline.current - now));
    return () => clearTimeout(timer);
  }, [callback, duration, enabled, offset]);
}
