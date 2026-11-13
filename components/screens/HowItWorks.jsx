'use client';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useFanModus } from '@/context/FanModusContext';
import FigmaScreen, { FigmaLayer, FigmaSvg, FigmaWordmark } from '@/components/ui/FigmaScreen';
import { howDesign as design, onboardingAssets as assets } from '@/lib/onboarding-design';
import styles from './Onboarding.module.css';

export default function HowItWorks() {
  const { dispatch } = useFanModus();
  return <FigmaScreen nodeId="41:10113" label="How FanModus works">
    <FigmaLayer layer={design.photo} className={styles.stadium}><Image src={assets.stadium} alt="" fill sizes="556px" priority/></FigmaLayer>
    <FigmaWordmark/>
    <FigmaLayer layer={design.title} as="h1" className={styles.howTitle}>How it<br/>works</FigmaLayer>
    <FigmaLayer layer={design.underline} className={styles.decoration}><FigmaSvg src={assets.underline}/></FigmaLayer>
    <ol className={styles.steps}>{design.steps.map(step => <li key={step.number}>
      <FigmaLayer layer={step.circle} className={styles.decoration}><FigmaSvg src={assets.circle}/></FigmaLayer>
      <FigmaLayer layer={step.digit} as="span" className={styles.digit} aria-hidden="true">{step.number}</FigmaLayer>
      {step.strips.map(([asset, layer]) => <FigmaLayer key={asset} layer={layer} className={styles.decoration}><FigmaSvg src={assets[asset]}/></FigmaLayer>)}
      <FigmaLayer layer={step.title} as="h2" className={styles.stepTitle}>{step.lines.map((line, i) => <span key={line}>{i > 0 && <br/>}{line}</span>)}</FigmaLayer>
      <FigmaLayer layer={step.description} as="p" className={styles.stepDescription}>{step.text}</FigmaLayer>
    </li>)}</ol>
    <FigmaLayer layer={design.paper}><motion.button type="button" className={styles.paperButton} aria-label="Continue to prizes" whileTap={{ scale: .98 }} onClick={() => dispatch({ type: 'NAVIGATE', screen: 'prizes' })}><Image src={assets.paper} alt="" fill sizes="294px" priority/></motion.button></FigmaLayer>
    <FigmaLayer layer={design.arrow} className={styles.decoration}><FigmaSvg src={assets.nextArrow}/></FigmaLayer>
  </FigmaScreen>;
}
