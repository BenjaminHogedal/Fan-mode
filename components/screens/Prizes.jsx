'use client';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useFanModus } from '@/context/FanModusContext';
import FigmaScreen, { FigmaLayer, FigmaSvg, FigmaWordmark } from '@/components/ui/FigmaScreen';
import { onboardingAssets as assets, prizeDesign as design } from '@/lib/onboarding-design';
import styles from './Onboarding.module.css';

export default function Prizes() {
  const { dispatch } = useFanModus();
  const matchReady = () => dispatch({ type: 'NAVIGATE', screen: 'activation' });
  return <><FigmaScreen nodeId="41:10114" label="Win FanModus prizes">
    <FigmaWordmark/>
    <FigmaLayer layer={design.crown} className={styles.decoration}>{design.crownParts.map((part, i) => <span className={styles.crownPart} key={i} style={{ left: part.left, top: part.top }}><FigmaSvg src={assets.crown[i]}/></span>)}</FigmaLayer>
    <FigmaLayer layer={design.title} as="h1" className={styles.prizeTitle}>Win prizes</FigmaLayer>
    <FigmaLayer layer={design.description} as="p" className={styles.prizeDescription}>The longer you stay phone-free, the higher your chance of winning</FigmaLayer>
    <FigmaLayer layer={design.jersey} className={styles.jerseyCrop}><Image src={assets.jersey} alt="Signed Borussia Dortmund jersey" width={252} height={252} sizes="252px" priority className={styles.jerseyPhoto}/></FigmaLayer>
    <FigmaLayer layer={design.signedStrip} className={styles.decoration}><FigmaSvg src={assets.signedStrip}/></FigmaLayer>
    <FigmaLayer layer={design.jerseyStrip} className={styles.decoration}><FigmaSvg src={assets.jerseyStrip}/></FigmaLayer>
    <FigmaLayer layer={design.signed} as="span" className={styles.jerseyLabel}>Signed</FigmaLayer>
    <FigmaLayer layer={design.jerseyLabel} as="span" className={styles.jerseyLabel}>Jersey</FigmaLayer>
    {design.dividers.map((layer, i) => <FigmaLayer key={i} layer={layer} className={styles.decoration}><FigmaSvg src={assets.divider}/></FigmaLayer>)}
    {['ticket', 'basket', 'more'].map(name => <FigmaLayer key={name} layer={design[name]} className={styles.decoration}><FigmaSvg src={assets[name]}/></FigmaLayer>)}
    <FigmaLayer layer={design.ticketText} as="p" className={styles.categoryText}>Match<br/>tickets</FigmaLayer>
    <FigmaLayer layer={design.basketText} as="p" className={styles.categoryText}>BVB<br/>merch</FigmaLayer>
    <FigmaLayer layer={design.moreText} as="p" className={styles.categoryText}>And more</FigmaLayer>
    <FigmaLayer layer={design.allPrizes}><button className={styles.allPrizesButton} disabled>See all prizes</button></FigmaLayer>
    <FigmaLayer layer={design.ready}><motion.button className={styles.readyButton} whileTap={{ scale: .98 }} onClick={matchReady}>Get match ready</motion.button></FigmaLayer>
    <FigmaLayer layer={design.readyArrow}><button className={styles.arrowButton} onClick={matchReady} aria-label="Get match ready"><FigmaSvg src={assets.matchArrow}/></button></FigmaLayer>
  </FigmaScreen>
  </>;
}
