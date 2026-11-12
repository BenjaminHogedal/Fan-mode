'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, useTransform, MotionConfig } from 'motion/react';
import { ChevronsRight } from 'lucide-react';
export default function SwipeToActivate({ onActivate, disabled }) {
  const track = useRef(null);
  const handle = useRef(null);
  const completed = useRef(false);
  const [travel, setTravel] = useState(0);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, Math.max(1, travel * 0.75)], [1, 0]);
  useEffect(() => {
    const observer = new ResizeObserver(() => setTravel(Math.max(0, track.current.clientWidth - handle.current.offsetWidth - 12)));
    observer.observe(track.current);
    return () => observer.disconnect();
  }, []);
  const activate = () => { if (!completed.current && !disabled) { completed.current = true; if (onActivate() === false) { completed.current = false; animate(x, 0, { duration: 0.2 }); } } };
  // Motion drag distances must use local design pixels, including both preview scales.
  const transformPagePoint = (point) => {
    const element = track.current;
    if (!element?.clientWidth) return point;
    const scale = element.getBoundingClientRect().width / element.clientWidth;
    return scale > 0 ? { x: point.x / scale, y: point.y / scale } : point;
  };
  return <MotionConfig transformPagePoint={transformPagePoint}><div className="swipe-wrap"><div className={`swipe-track ${disabled ? 'disabled' : ''}`} ref={track}><motion.span className="swipe-label" style={{ opacity }}>SWIPE TO ACTIVATE</motion.span><motion.button ref={handle} className="swipe-handle" aria-label="Activate FanModus. Drag right or press Enter." disabled={disabled} style={{ x, touchAction: 'pan-y' }} drag={disabled ? false : 'x'} dragConstraints={{ left: 0, right: travel }} dragElastic={0} dragMomentum={false} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } }} onDragEnd={() => { if (travel > 0 && x.get() >= travel * 0.82) activate(); else animate(x, 0, { type: 'spring', stiffness: 400, damping: 32 }); }}><ChevronsRight size={28} /></motion.button></div><p className="fine-print">Drag right, or focus the handle and press Enter.</p></div></MotionConfig>;
}
