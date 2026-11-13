'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { motion } from 'motion/react';
import { useFanModus } from '@/context/FanModusContext';
import { introAssets, introLayers } from '@/lib/intro-design';
import styles from './Intro.module.css';

const introBody = localFont({ src: '../../public/fonts/intro-space-grotesk-variable.ttf', weight: '300 700', variable: '--font-intro-body', display: 'swap' });

function Layer({ name, children, className = '', as: Tag = 'div' }) {
  const { nodeId, width, height, matrix } = introLayers[name];
  return <Tag className={`${styles.layer} ${className}`} data-node-id={nodeId} style={{ width, height, transform: `matrix(${matrix.join(',')})` }}>{children}</Tag>;
}

function SvgAsset({ name }) {
  // Native SVG images retain the exact fractional intrinsic dimensions from Figma.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.svgAsset} src={introAssets[name]} alt="" aria-hidden="true" draggable="false"/>;
}

export default function Intro() {
  const { dispatch } = useFanModus();
  const viewport = useRef(null);
  useLayoutEffect(() => {
    const element = viewport.current;
    const update = () => element.style.setProperty('--intro-scale', String(element.clientWidth / 390));
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, []);

  return <div ref={viewport} className={`${styles.viewport} ${introBody.variable}`}>
    <section className={styles.canvas} data-node-id="41:10112" aria-label="Welcome to FanModus">
      <Layer name="fans" className={styles.fans}><Image src={introAssets.fans} alt="" fill sizes="630px" priority draggable={false}/></Layer>
      <button className={styles.clubBack} aria-label="Back to BVB menu" onClick={() => dispatch({ type: 'BACK' })} data-node-id="62:10152"><Image src={introAssets.bvb} alt="Borussia Dortmund" fill sizes="79px" priority/></button>
      <div className={styles.brand} data-node-id="64:10629"><Image src={introAssets.vodafone} alt="Vodafone" width={19} height={19}/><span>Fan<span>Modus</span></span></div>
      <h1 className={styles.headline}>
        <Layer name="brushTop" as="span"><SvgAsset name="brushTop"/></Layer>
        <Layer name="brushMiddle" as="span"><SvgAsset name="brushMiddle"/></Layer>
        <Layer name="brushBottom" as="span"><SvgAsset name="brushBottom"/></Layer>
        <Layer name="minutes" as="span" className={styles.headlineText}>90 minutes</Layer>{' '}
        <Layer name="without" as="span" className={styles.headlineText}>without</Layer>{' '}
        <Layer name="phone" as="span" className={styles.headlineText}>your phone.</Layer>
      </h1>
      <Layer name="underline"><SvgAsset name="underline"/></Layer>
      <p className={styles.description} data-node-id="64:10638">Be part of the atmosphere, stay present and win exclusive prizes.</p>
      <Layer name="arrow"><SvgAsset name="arrow"/></Layer>
      <Layer name="cta"><motion.button className={styles.cta} whileTap={{ scale: 0.98 }} onClick={() => dispatch({ type: 'NAVIGATE', screen: 'how' })}><Image src={introAssets.paper} alt="" fill sizes="294px" priority draggable={false}/><span>Get started</span></motion.button></Layer>
    </section>
  </div>;
}
