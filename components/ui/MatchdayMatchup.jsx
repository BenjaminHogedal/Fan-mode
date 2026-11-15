import Image from 'next/image';
import { getMatchdayHeaderAssets } from '@/lib/assets';
import { useFanModus } from '@/context/FanModusContext';
import styles from './MatchdayMatchup.module.css';

export default function MatchdayMatchup() {
  const { match } = useFanModus();
  const matchAssets = getMatchdayHeaderAssets(match);
  return <div className={styles.slot}>
    <div className={styles.group} data-node-id="324:1112" role="img" aria-label={`Borussia Dortmund versus ${match.opponent_name}`}>
      <span className={styles.bvb} data-node-id="324:1113"><Image src={matchAssets.bvb} alt="" fill sizes="31px" priority/></span>
      <span className={styles.versus} data-node-id="324:1114" aria-hidden="true">VS</span>
      <span className={styles.opponent} data-node-id="324:1118"><Image src={matchAssets.opponent} alt="" fill sizes="27px" priority unoptimized/></span>
    </div>
  </div>;
}
