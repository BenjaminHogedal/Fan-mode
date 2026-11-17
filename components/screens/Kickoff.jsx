'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import { useFanModus, useFanModusClock } from '@/context/FanModusContext';
import { formatTime, PHASE_SECONDS } from '@/lib/fanmodus';
import MatchChrome from '@/components/ui/MatchChrome';
import FigmaScreen from '@/components/ui/FigmaScreen';
import styles from './Kickoff.module.css';

const digital = localFont({ src: '../../public/fonts/kickoff-digital-numbers.woff2', weight: '400', variable: '--font-kickoff-digital', display: 'swap' });
const inter = localFont({ src: '../../public/fonts/kickoff-inter-variable.woff2', weight: '100 900', variable: '--font-kickoff-body', display: 'swap' });

/** Figma 43:10124; the session clock remains the source of truth. */
export default function Kickoff({ onNext }) {
  const { session } = useFanModus();
  const { now } = useFanModusClock();
  const remaining = Math.min(PHASE_SECONDS['pre-match'], Math.max(0, Math.ceil((session.phaseEndsAt - now) / 1000)));
  return <FigmaScreen nodeId="43:10124" label="Countdown to kick-off"><div className={`${digital.variable} ${inter.variable}`}>
    <div className={styles.crowd}><Image src="/images/kickoff/crowd.webp" alt="" fill sizes="578px" priority/></div>
    <MatchChrome/>
    <h1 className={styles.title}>Kickoff in</h1>
    <div className={styles.timer} role="timer" aria-label={`${formatTime(remaining)} until kick-off`}>{formatTime(remaining)}</div>
    <p className={styles.hint}>But you dont have to wait untill kick-off to put your phone away.</p>
    <button type="button" className={styles.advance} onClick={onNext} aria-label="Continue to first half"/>
  </div></FigmaScreen>;
}
