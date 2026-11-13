'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import { useFanModus } from '@/context/FanModusContext';
import { formatTime } from '@/lib/fanmodus';
import FigmaScreen from '@/components/ui/FigmaScreen';
import MatchChrome from '@/components/ui/MatchChrome';
import styles from './LiveMatch.module.css';

const digital = localFont({ src: '../../public/fonts/kickoff-digital-numbers.ttf', weight: '400', variable: '--font-match-digital', display: 'swap' });

export function ActiveHalf({ onNext }) {
  const { session, seconds } = useFanModus();
  const second = session.matchPhase === 'second';
  return <FigmaScreen nodeId={second ? '44:10137' : '153:66'} label={second ? 'Second half' : 'First half'}><div className={digital.variable}>
    <div className={styles.chevrons} aria-hidden="true"/>
    <MatchChrome/>
    <h1 className={styles.title}>phone free time</h1>
    <div className={styles.timer} role="timer" aria-label={`${formatTime(seconds)} phone-free time`}>{formatTime(seconds)}</div>
    <button type="button" className={styles.advance} onClick={onNext} aria-label={second ? 'Continue to full time' : 'Continue to half-time'}/>
  </div></FigmaScreen>;
}

export function HalfTime() {
  const { session, now } = useFanModus();
  const remaining = Math.max(0, Math.ceil((session.phaseEndsAt - now) / 1000));
  // Figma's compact halftime display uses an unpadded minute, e.g. 9:48.
  const time = formatTime(remaining).replace(/^0(?=\d:)/, '');
  return <FigmaScreen nodeId="44:10136" label="Half-time"><div className={digital.variable}>
    <div className={styles.crowd}><Image src="/images/kickoff/crowd.png" alt="" fill sizes="500px" priority/></div>
    <MatchChrome/>
    <h1 className={styles.halfTitle}><span className={styles.half}>Half</span><span className={styles.time}>Time</span></h1>
    <h2 className={styles.paused}>fan mode paused.</h2>
    <p className={styles.safe}>Your entries are safe.<br/>Earning resumes in the second half.</p>
    <p className={styles.next}>The second half starts in</p>
    <div className={styles.countdown} role="timer" aria-label={`${time} until the second half`}>{time}</div>
  </div></FigmaScreen>;
}
