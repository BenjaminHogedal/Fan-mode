'use client';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import localFont from 'next/font/local';
import FigmaScreen, { FigmaSvg } from './FigmaScreen';
import styles from './States.module.css';

const inter = localFont({ src: '../../public/fonts/kickoff-inter-variable.ttf', weight: '100 900', display: 'swap' });
const stands = ['north', 'east', 'south', 'west'];

export default function LoadingState({ onClose }) {
  const [phase, setPhase] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    // Figma: 40 ms delay + 280 ms ease-in-out between each of four phases.
    let timer;
    const start = setTimeout(() => {
      setPhase(value => (value + 1) % 4);
      timer = setInterval(() => setPhase(value => (value + 1) % 4), 320);
    }, 40);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [reduced]);
  return <FigmaScreen nodeId="607:1476" label="Loading">
    <div className={styles.stadium} role="status">
      <div className={styles.rim}/><div className={styles.pitch}/><div className={styles.midline}/>
      <div className={styles.circle}><FigmaSvg src="/images/states/center-circle.svg"/></div>
      <div className={styles.penaltyLeft}/><div className={styles.penaltyRight}/>
      {stands.map((stand, index) => <div key={stand} className={`${styles.stand} ${styles[stand]}`} style={{ opacity: phase === index ? 1 : 0.18 }}>{Array.from({ length: 7 }, (_, seat) => <i key={seat}/>)}</div>)}
      <h1 className={styles.loadingTitle}>Loading...</h1>
      <p className={`${styles.loadingCopy} ${inter.className}`}>Your matchday experience is loading.</p>
      <div className={styles.indicators} aria-hidden="true">{stands.map((stand, index) => <i key={stand} style={{ opacity: phase === index ? 1 : 0.25 }}/>)}</div>
    </div>
    {onClose && <button className={styles.dismissLoading} aria-label="Return to demo" onClick={onClose}/>}
  </FigmaScreen>;
}
