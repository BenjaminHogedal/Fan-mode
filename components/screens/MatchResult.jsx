'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import { useFanModus } from '@/context/FanModusContext';
import { formatTime } from '@/lib/fanmodus';
import FigmaScreen, { FigmaSvg } from '@/components/ui/FigmaScreen';
import styles from './MatchResult.module.css';

const suez = localFont({ src: '../../public/fonts/suez-one.ttf', weight: '400', display: 'swap' });
const condensed = localFont({ src: [{ path: '../../public/fonts/barlow-condensed-300.ttf', weight: '300' }, { path: '../../public/fonts/barlow-condensed-400.ttf', weight: '400' }], display: 'swap' });

export function MatchSummary() {
  const { seconds, entries, dispatch } = useFanModus();
  return <FigmaScreen nodeId="746:1331" label="Your match result">
    <div className={styles.resultBackground}><Image src="/images/result/background.png" alt="" fill sizes="505px" priority/></div>
    <div className={styles.brushTop}><FigmaSvg src="/images/result/brush-top.svg"/></div>
    <div className={styles.brushBottom}><FigmaSvg src="/images/result/brush-bottom.svg"/></div>
    <div className={styles.rays}><FigmaSvg src="/images/result/rays.svg"/></div>
    <div className={styles.ticketBlack}/>
    <button className={styles.close} onClick={() => dispatch({ type: 'NAVIGATE', screen: 'menu' })} aria-label="Back to BVB menu"><FigmaSvg src="/images/result/close.svg"/></button>
    <div className={styles.ticket}><Image src="/images/result/ticket.png" alt="" fill sizes="216px" priority/></div>
    <p className={styles.collected}>you have collected</p>
    <p className={styles.entriesLabel}>entries!</p>
    <div className={styles.paper}><Image src="/images/result/paper.png" alt="" fill sizes="328px"/></div>
    <div className={styles.brushNumber}><FigmaSvg src="/images/result/brush-number.svg"/></div>
    <strong className={styles.entries}>{entries}</strong>
    <p className={`${styles.awesome} ${suez.className}`}>YOU ARE AWESOME!</p>
    <div className={styles.time}><span>Phone-free time</span><strong>{formatTime(seconds)}</strong></div>
    <button className={styles.resultCta} onClick={() => dispatch({ type: 'NAVIGATE', screen: 'thanks' })}><span>View your match ticket</span><FigmaSvg src="/images/result/arrow.svg"/></button>
  </FigmaScreen>;
}

export function ThankYou({ onShare, onStats }) {
  const { dispatch } = useFanModus();
  return <FigmaScreen nodeId="44:10143" label="Thanks for being present">
    <div className={styles.thanksBackground}><Image src="/images/thanks/background.png" alt="" fill sizes="481px" priority/></div>
    <div className={styles.rings}><FigmaSvg src="/images/thanks/rings.svg"/></div>
    <button className={styles.club} onClick={onShare} aria-label="View your match ticket"><Image src="/images/post-match/bvb.png" alt="Borussia Dortmund" width={93} height={93}/></button>
    <h1 className={styles.thanksTitle}>thanks for<br/><span>being present!</span></h1>
    <p className={`${styles.thanksCopy} ${condensed.className}`}>You made every minute count.<br/>See you at the next match!</p>
    <button className={styles.prizeCta} onClick={() => dispatch({ type: 'NAVIGATE', screen: 'prize' })}><span>See if you’ve won</span><FigmaSvg src="/images/result/arrow.svg"/></button>
    <button className={`${styles.statistics} ${condensed.className}`} onClick={onStats}><FigmaSvg src="/images/thanks/stats.svg"/><span>See match statistics</span></button>
  </FigmaScreen>;
}
