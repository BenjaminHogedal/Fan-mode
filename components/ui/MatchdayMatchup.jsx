import Image from 'next/image';
import { matchdayHeaderAssets } from '@/lib/assets';
import styles from './MatchdayMatchup.module.css';

export default function MatchdayMatchup() {
  return <div className={styles.slot}>
    <div className={styles.group} data-node-id="324:1112" role="img" aria-label="Borussia Dortmund versus SC Freiburg">
      <span className={styles.bvb} data-node-id="324:1113"><Image src={matchdayHeaderAssets.bvb} alt="" fill sizes="31px" priority/></span>
      <span className={styles.versus} data-node-id="324:1114" aria-hidden="true">VS</span>
      <span className={styles.freiburg} data-node-id="324:1118"><Image src={matchdayHeaderAssets.freiburg} alt="" fill sizes="27px" priority/></span>
    </div>
  </div>;
}
