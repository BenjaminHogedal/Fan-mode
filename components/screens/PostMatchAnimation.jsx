'use client';
import { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import FigmaScreen from '@/components/ui/FigmaScreen';
import MatchChrome from '@/components/ui/MatchChrome';
import { useFanModus } from '@/context/FanModusContext';
import useSessionTimeout from '@/components/animations/useSessionTimeout';
import styles from './PostMatchAnimation.module.css';

// Original Figma GIFs; the collecting screen advances early to keep the flow brisk.
const stages = {
  fulltime: { nodeId: '44:10138', imageNodeId: '170:167', src: '/images/post-match/fulltime.gif', duration: 4040, next: 'collecting', label: 'Full time' },
  collecting: { nodeId: '44:10139', imageNodeId: '168:163', src: '/images/post-match/entries.gif', duration: 3800, next: 'summary', label: 'Collecting entries...' },
};

export default function PostMatchAnimation({ stage }) {
  const { dispatch } = useFanModus();
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const animation = stages[stage];
  const fulltime = stage === 'fulltime';
  useSessionTimeout(
    () => dispatch({ type: 'NAVIGATE', screen: animation.next }),
    reduced || failed ? 1000 : animation.duration,
    loaded || reduced || failed,
  );

  return <FigmaScreen nodeId={animation.nodeId} label={animation.label}>
    {fulltime && <MatchChrome/>}
    {!reduced && !failed && <div className={styles[stage]} data-node-id={animation.imageNodeId}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={animation.src} alt="" draggable={false} onLoad={() => setLoaded(true)} onError={() => setFailed(true)}/>
    </div>}
    {!fulltime && <p className={styles.caption} data-node-id="168:164">Collecting <br/>entries...</p>}
    <p className={fulltime && (reduced || failed) ? styles.caption : styles.srOnly} role="status">{animation.label}</p>
  </FigmaScreen>;
}
