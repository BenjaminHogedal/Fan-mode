'use client';
import { useLayoutEffect, useRef } from 'react';
import localFont from 'next/font/local';
import Image from 'next/image';
import { introAssets } from '@/lib/intro-design';
import styles from './FigmaScreen.module.css';

const bodyFont = localFont({ src: '../../public/fonts/intro-space-grotesk-variable.ttf', weight: '300 700', variable: '--font-figma-body', display: 'swap' });

/** Responsive presentation of a Figma collage; shared status chrome stays outside. */
export default function FigmaScreen({ nodeId, label, children }) {
  const viewport = useRef(null);
  useLayoutEffect(() => {
    const element = viewport.current;
    const update = () => element.style.setProperty('--figma-scale', String(element.clientWidth / 390));
    const observer = new ResizeObserver(update);
    observer.observe(element); update();
    return () => observer.disconnect();
  }, []);
  return <div ref={viewport} className={`${styles.viewport} ${bodyFont.variable}`}><section className={styles.canvas} data-node-id={nodeId} aria-label={label}>{children}</section></div>;
}

export function FigmaLayer({ layer, children, className = '', as: Tag = 'div', ...props }) {
  const { width, height, matrix, nodeId } = layer;
  return <Tag {...props} className={`${styles.layer} ${className}`} data-node-id={nodeId} style={{ width, height, transform: `matrix(${matrix.join(',')})` }}>{children}</Tag>;
}

export function FigmaSvg({ src }) {
  // External SVGs retain Figma's exact, sometimes fractional, intrinsic root dimensions.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.svg} src={src} alt="" aria-hidden="true" draggable="false"/>;
}

export function FigmaWordmark() {
  return <div className={styles.brand}><Image src={introAssets.vodafone} alt="Vodafone" width={19} height={19}/><span>Fan<span>Modus</span></span></div>;
}
