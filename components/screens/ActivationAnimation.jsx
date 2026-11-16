'use client';
import { useEffect, useState } from 'react';
import localFont from 'next/font/local';
import { useReducedMotion } from 'motion/react';
import FigmaScreen from '@/components/ui/FigmaScreen';
import { useFanModus } from '@/context/FanModusContext';
import styles from './ActivationAnimation.module.css';

const captionFont = localFont({ src: '../../public/fonts/barlow-semi-condensed-600.ttf', weight: '600', display: 'swap' });

// Durations measured from the original Figma GIF frame delays.
const animations = {
  progress: { nodeId: '41:10116', imageNodeId: '118:107', src: '/images/activation-animation/counter.gif', duration: 4040, label: 'Activating FanMode' },
  success: { nodeId: '43:10123', imageNodeId: '123:113', src: '/images/activation-animation/active.gif', duration: 2440, label: 'FanMode activated' },
};

export default function ActivationAnimation({ stage }) {
  const { dispatch } = useFanModus();
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const animation = animations[stage];
  useEffect(() => {
    if (!loaded && !reduced) return;
    const timer = setTimeout(() => dispatch(stage === 'progress' ? { type: 'ACTIVATED' } : { type: 'NAVIGATE', screen: 'kickoff' }), reduced ? 1000 : animation.duration);
    return () => clearTimeout(timer);
  }, [loaded, reduced, stage, animation.duration, dispatch]);

  return <FigmaScreen nodeId={animation.nodeId} label={animation.label}>
    {!reduced && <div className={styles[stage]} data-node-id={animation.imageNodeId}>
      {/* Preserve the original animated image and Figma's crop. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={animation.src} alt="" onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} draggable={false}/>
    </div>}
    {stage === 'progress' && <p className={`${styles.caption} ${captionFont.className}`} data-node-id="118:108">Activating FanMode<span>...</span></p>}
    <p className={reduced ? styles.reduced : styles.srOnly} role="status">{reduced && stage === 'progress' ? 'Getting match ready' : animation.label}</p>
  </FigmaScreen>;
}
