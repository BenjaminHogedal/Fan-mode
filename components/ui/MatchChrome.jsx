import Image from 'next/image';
import { introAssets } from '@/lib/intro-design';
import styles from './MatchChrome.module.css';

/** Shared match header from Figma component 456:1660; status bar lives in the app shell. */
export default function MatchChrome() {
  return <><div className={styles.gradient} aria-hidden="true"/><div className={styles.match} aria-label="Borussia Dortmund versus SC Freiburg"><Image src={introAssets.bvb} alt="Borussia Dortmund" width={62} height={62}/><span>VS</span><Image src="/images/kickoff/freiburg.png" alt="SC Freiburg" width={62} height={62}/></div></>;
}
