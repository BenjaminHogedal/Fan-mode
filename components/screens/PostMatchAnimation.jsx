'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import FigmaScreen from '@/components/ui/FigmaScreen';
import { useFanModus } from '@/context/FanModusContext';
import styles from './PostMatchAnimation.module.css';

// Original Figma GIFs: play one complete sequence before advancing.
const stages = {
  fulltime: { nodeId: '44:10138', imageNodeId: '170:167', src: '/images/post-match/fulltime.gif', duration: 4040, next: 'collecting', label: 'Full time' },
  collecting: { nodeId: '44:10139', imageNodeId: '168:163', src: '/images/post-match/entries.gif', duration: 5040, next: 'summary', label: 'Collecting entries...' },
};

export default function PostMatchAnimation({ stage }) {
  const { dispatch } = useFanModus();
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const animation = stages[stage];
  const fulltime = stage === 'fulltime';
  useEffect(() => {
    if (!loaded && !reduced && !failed) return;
    const timer = setTimeout(() => dispatch({ type: 'NAVIGATE', screen: animation.next }), reduced || failed ? 1000 : animation.duration);
    return () => clearTimeout(timer);
  }, [loaded, reduced, failed, animation, dispatch]);

  return <FigmaScreen nodeId={animation.nodeId} label={animation.label}>
    {fulltime && <>
      <div className={styles.gradient} data-node-id="164:157"/>
      <div className={styles.match} aria-label="Borussia Dortmund versus SC Freiburg">
        <Image src="/images/post-match/bvb.png" alt="Borussia Dortmund" width={31} height={31} priority/>
        <span>VS</span>
        <Image src="/images/post-match/freiburg.png" alt="SC Freiburg" width={31} height={31} priority/>
      </div>
    </>}
    {!reduced && !failed && <div className={styles[stage]} data-node-id={animation.imageNodeId}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={animation.src} alt="" draggable={false} onLoad={() => setLoaded(true)} onError={() => setFailed(true)}/>
    </div>}
    {!fulltime && <p className={styles.caption} data-node-id="168:164">Collecting <br/>entries...</p>}
    <p className={fulltime && (reduced || failed) ? styles.caption : styles.srOnly} role="status">{animation.label}</p>
  </FigmaScreen>;
}
