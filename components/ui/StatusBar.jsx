import { introAssets } from '@/lib/intro-design';
import styles from './IntroStatusBar.module.css';
import { Signal, Wifi, BatteryFull } from 'lucide-react';

export default function StatusBar({ appearance = 'default' }) {
  if (appearance === 'intro') {
    return <div className={styles.bar} aria-label="Status bar preview: 9:41, full signal, Wi-Fi connected, full battery"><span className={styles.time}>9:41</span><div className={styles.icons} aria-hidden="true"><span className={styles.signal}><i/><i/><i/><i/></span>{/* Preserve the original Figma SVGs and their fractional intrinsic dimensions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={introAssets.wifi} alt=""/>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={introAssets.battery} alt=""/>
    </div></div>;
  }
  return <div className="ios-status-bar" aria-label="Status bar preview: 9:41, full signal, Wi-Fi connected, full battery"><span className="ios-time">9:41</span><div className="ios-status-icons" aria-hidden="true"><Signal size={18} strokeWidth={3}/><Wifi size={18} strokeWidth={2.5}/><BatteryFull size={24} strokeWidth={2}/></div></div>;
}
