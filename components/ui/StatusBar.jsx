import { introAssets } from '@/lib/intro-design';
import styles from './StatusBar.module.css';

/** One persistent iOS preview bar, shared by every screen and kept above overlays. */
export default function StatusBar({ tone = 'light' }) {
  return <div className={styles.bar} data-tone={tone} aria-label="Status bar preview: 9:41, full signal, Wi-Fi connected, full battery"><span className={styles.time}>9:41</span><div className={styles.icons} aria-hidden="true"><span className={styles.signal}><i/><i/><i/><i/></span>
    {/* Preserve the original SVG assets' intrinsic dimensions. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={introAssets.wifi} alt=""/>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={introAssets.battery} alt=""/>
  </div></div>;
}
