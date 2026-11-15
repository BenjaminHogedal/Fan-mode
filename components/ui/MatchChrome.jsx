import Image from 'next/image';
import { introAssets } from '@/lib/intro-design';
import { useFanModus } from '@/context/FanModusContext';
import styles from './MatchChrome.module.css';

/** Shared match header from Figma component 456:1660; status bar lives in the app shell. */
export default function MatchChrome() {
  const { match } = useFanModus();
  return <><div className={styles.gradient} aria-hidden="true"/><div className={styles.match} aria-label={`Borussia Dortmund versus ${match.opponent_name}`}><Image src={introAssets.bvb} alt="Borussia Dortmund" width={62} height={62}/><span>VS</span><Image src={match.opponent_logo} alt={match.opponent_name} width={62} height={62} unoptimized/></div></>;
}
