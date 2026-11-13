'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import localFont from 'next/font/local';
import { useFanModus } from '@/context/FanModusContext';
import { activationAssets } from '@/lib/activation-design';
import SwipeToActivate from '@/components/animations/SwipeToActivate';
import styles from './Activation.module.css';

const archivo = localFont({ src: '../../public/fonts/activation-archivo-black.ttf', weight: '400', variable: '--font-activation-heading', display: 'swap' });

function OriginalSvg({ name }) {
  // Keep the unmodified Figma SVG's intrinsic root dimensions.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={activationAssets[name]} alt="" aria-hidden="true" draggable="false"/>;
}

export default function Activation({ onLocation, onActivate, onValidate }) {
  const { session } = useFanModus();
  const viewport = useRef(null);
  const allowed = session.locationPermission === 'granted';
  useLayoutEffect(() => {
    const element = viewport.current;
    const update = () => element.style.setProperty('--activation-scale', String(element.clientWidth / 390));
    const observer = new ResizeObserver(update);
    observer.observe(element); update();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (session.locationPermission !== 'unknown') return;
    // The Figma screen opens the location overlay after one second.
    const id = setTimeout(onLocation, 1000);
    return () => clearTimeout(id);
  }, [session.locationPermission, onLocation]);

  return <div ref={viewport} className={`${styles.viewport} ${archivo.variable}`}>
    <section className={styles.canvas} data-node-id="41:10115" aria-label="Activate FanModus">
      <div className={styles.activate} data-node-id="102:55">Activate</div>
      <h1 className={styles.title} data-node-id="102:56">Fan<span>Modus</span></h1>
      <button className={styles.power} onClick={onLocation} aria-label={allowed ? 'Review simulated stadium location' : 'Enable simulated stadium location'} data-node-id="102:52"><OriginalSvg name="power"/></button>
      <div className={styles.rule} aria-label="One phone-free minute equals one entry">
        <span className={styles.minute} data-node-id="113:90">1 minute</span>
        <span className={styles.equals} data-node-id="113:91">=</span>
        <span className={styles.entry} data-node-id="113:96">1 entry</span>
        <span className={styles.ticket} data-node-id="113:101"><OriginalSvg name="ticket"/></span>
      </div>
      <div className={styles.slider} data-node-id="100:21113"><SwipeToActivate active={session.currentScreen === 'activation'} disabled={!allowed} onValidate={onValidate} onActivate={onActivate}/></div>
      <p className={styles.srOnly} role="status">{allowed ? 'Stadium location confirmed. Swipe right to activate, or focus the handle and press Enter.' : 'Location permission is required. The location dialog will open automatically. You can also press the power symbol to open it.'}</p>
    </section>
  </div>;
}
