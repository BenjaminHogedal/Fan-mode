'use client';
import Image from 'next/image';
import { playSwipeSequence } from '@/lib/swipe-sequence';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, animate, useTransform, MotionConfig, useReducedMotion } from 'motion/react';
import { activationAssets, swipeLayout, swipeTiming } from '@/lib/activation-design';
import styles from './SwipeToActivate.module.css';

function OriginalSvg({ name }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={activationAssets[name]} alt="" aria-hidden="true" draggable="false"/>;
}

export default function SwipeToActivate({ onActivate, onValidate, disabled = false, active = true }) {
  const track = useRef(null);
  const lifetime = useRef(null);
  const animation = useRef(null);
  const busy = useRef(false);
  const callbacks = useRef({ onActivate, onValidate });
  const [mode, setMode] = useState('initiate');
  const [error, setError] = useState('');
  const [travel, setTravel] = useState(272);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const labelOpacity = useTransform(x, [0, Math.max(1, travel * 0.75)], [1, 0]);
  const transition = { duration: reduced ? 0 : swipeTiming.transition, ease: 'easeOut' };
  useLayoutEffect(() => { callbacks.current = { onActivate, onValidate }; }, [onActivate, onValidate]);
  useLayoutEffect(() => {
    // AnimatePresence keeps the outgoing screen mounted briefly; cancel at navigation,
    // rather than waiting for unmount, so it cannot activate during its exit fade.
    if (!active) { lifetime.current?.abort(); animation.current?.stop(); }
  }, [active]);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const distance = Math.max(0, track.current.clientWidth - 2 * swipeLayout.inset - swipeLayout.handle);
      setTravel(distance);
      if (!busy.current) x.set(0);
    });
    observer.observe(track.current);
    return () => { observer.disconnect(); lifetime.current?.abort(); animation.current?.stop(); };
  }, [x]);

  function reset() {
    busy.current = false;
    setMode('initiate');
    animation.current = animate(x, 0, { duration: reduced ? 0 : swipeTiming.transition, ease: 'easeOut' });
  }
  async function begin() {
    if (busy.current || disabled || !active) return;
    if (callbacks.current.onValidate?.() === false) { reset(); return; }
    busy.current = true;
    setError(''); setMode('trigger');
    const controller = new AbortController();
    lifetime.current = controller;
    const transitionMs = reduced ? 0 : swipeTiming.transition * 1000;
    animation.current = animate(x, travel, { duration: transitionMs / 1000, ease: 'easeOut' });
    try {
      const completed = await playSwipeSequence({ signal: controller.signal, reducedMotion: Boolean(reduced), onStage: setMode, onComplete: () => callbacks.current.onActivate() });
      if (!completed && !controller.signal.aborted) reset();
    } catch {
      if (!controller.signal.aborted) { reset(); setError('Activation could not start. Please try again.'); }
    }
  }
  function release() {
    if (busy.current) return;
    if (travel > 0 && x.get() >= travel * swipeLayout.threshold) begin();
    else animation.current = animate(x, 0, reduced ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 });
  }
  // Normalize both the desktop frame scale and the responsive reference canvas scale.
  const transformPagePoint = point => {
    const element = track.current;
    if (!element?.clientWidth) return point;
    const scale = element.getBoundingClientRect().width / element.clientWidth;
    return scale > 0 ? { x: point.x / scale, y: point.y / scale } : point;
  };
  const status = { initiate: 'Swipe right to activate FanModus, or focus the handle and press Enter.', trigger: 'Swipe complete.', loading: 'Preparing FanModus.', completed: 'Ready. Activating FanModus.' }[mode];

  return <MotionConfig transformPagePoint={transformPagePoint}>
    <motion.div ref={track} className={styles.track} data-state={mode} aria-busy={mode !== 'initiate'} animate={{ backgroundColor: mode === 'completed' ? '#FDE100' : '#C4A900' }} transition={transition}>
      <motion.div className={styles.shine} aria-hidden="true" initial={false} animate={{ x: mode === 'completed' ? '100%' : '-100%', opacity: ['loading', 'completed'].includes(mode) ? 1 : 0 }} transition={transition}/>
      {['initiate', 'trigger'].includes(mode) && <motion.button className={styles.handle} type="button" aria-label="Activate FanModus. Drag right or press Enter." disabled={disabled || !active || mode !== 'initiate'} style={{ x }} drag={disabled || !active || mode !== 'initiate' ? false : 'x'} dragConstraints={{ left: 0, right: travel }} dragElastic={0} dragMomentum={false} onDragEnd={release} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); begin(); } }}><motion.span className={styles.disc} animate={{ rotate: mode === 'trigger' ? 180 : 0 }} transition={transition}><OriginalSvg name="handle"/><span className={styles.chevrons} style={{ '--chevrons-image': `url('${activationAssets.chevrons}')` }}/></motion.span></motion.button>}
      {mode === 'initiate' && <motion.p className={styles.label} style={{ opacity: labelOpacity }}>Swipe to activate FanModus</motion.p>}
      <AnimatePresence initial={false}>
        {mode === 'loading' && <motion.div key="loading" className={styles.stateIcon} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>{reduced ? <span className={styles.reducedLoading}>···</span> : <Image src={activationAssets.loading} alt="" width={48} height={48} unoptimized/>}</motion.div>}
        {mode === 'completed' && <motion.div key="completed" className={styles.stateIcon} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}><OriginalSvg name="completed"/></motion.div>}
      </AnimatePresence>
    </motion.div>
    <p className={styles.srOnly} role="status">{error || status}</p>
  </MotionConfig>;
}
