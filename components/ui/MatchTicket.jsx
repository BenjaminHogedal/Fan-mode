'use client';
import Image from 'next/image';
import localFont from 'next/font/local';
import { FigmaSvg } from './FigmaScreen';
import { formatTime } from '@/lib/fanmodus';
import styles from './MatchTicket.module.css';

const digital = localFont({ src: '../../public/fonts/kickoff-digital-numbers.ttf', weight: '400', display: 'swap' });
export default function MatchTicket({ seconds, entries }) {
  return <div className={styles.ticket} data-node-id="180:215" aria-label={`${formatTime(seconds)} phone-free time, ${entries} entries earned`}>
    <div className={styles.body}><FigmaSvg src="/images/share/ticket.svg"/></div>
    <div className={styles.underline}><FigmaSvg src="/images/share/underline.svg"/></div>
    <div className={styles.score}><Image src="/images/post-match/bvb.png" alt="Borussia Dortmund" width={64.417} height={64.433}/><strong>2 - 1</strong><Image src="/images/post-match/freiburg.png" alt="SC Freiburg" width={64.425} height={64.425}/></div>
    <div className={styles.leftNotch}><FigmaSvg src="/images/share/side-notch.svg"/></div>
    <div className={styles.rightNotch}><FigmaSvg src="/images/share/side-notch.svg"/></div>
    <div className={styles.band}/>
    <div className={styles.bottomNotch}><FigmaSvg src="/images/share/notch.svg"/></div>
    <h2 className={styles.title}>match<br/>experience</h2>
    <div className={styles.topNotch}><FigmaSvg src="/images/share/notch.svg"/></div>
    <p className={styles.brand}>fan mode</p>
    <div className={styles.barcode}><FigmaSvg src="/images/share/barcode.svg"/></div>
    <div className={styles.stats}>
      <div><FigmaSvg src="/images/share/phone.svg"/><strong className={`${styles.time} ${digital.className}`}>{formatTime(seconds)}</strong><span>Phone-free time</span></div>
      <div><div className={styles.entryIcon}><FigmaSvg src="/images/share/phone2.svg"/><div className={styles.entryGraphic}><FigmaSvg src="/images/share/entry.svg"/></div></div><strong className={styles.entries}>{entries}</strong><span>Entries earned</span></div>
    </div>
  </div>;
}
