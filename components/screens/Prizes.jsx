'use client';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useFanModus } from '@/context/FanModusContext';
import FigmaScreen, { FigmaLayer, FigmaSvg, FigmaWordmark } from '@/components/ui/FigmaScreen';
import Modal from '@/components/ui/Modal';
import { Asset, Button } from '@/components/ui/Primitives';
import { onboardingAssets as assets, prizeDesign as design } from '@/lib/onboarding-design';
import styles from './Onboarding.module.css';

export default function Prizes() {
  const { dispatch } = useFanModus();
  const [showPrizes, setShowPrizes] = useState(false);
  const closePrizes = useCallback(() => setShowPrizes(false), []);
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
    <FigmaLayer layer={design.allPrizes}><button className={styles.allPrizesButton} onClick={() => setShowPrizes(true)}>See all prizes</button></FigmaLayer>
    <FigmaLayer layer={design.ready}><motion.button className={styles.readyButton} whileTap={{ scale: .98 }} onClick={matchReady}>Get match ready</motion.button></FigmaLayer>
    <FigmaLayer layer={design.readyArrow}><button className={styles.arrowButton} onClick={matchReady} aria-label="Get match ready"><FigmaSvg src={assets.matchArrow}/></button></FigmaLayer>
  </FigmaScreen>
  {showPrizes && <Modal title="MATCHDAY REWARDS" onClose={closePrizes}><div className="all-prizes-list"><div><span className="asset-image"><Image src={assets.jersey} alt="Signed BVB jersey" fill sizes="95px"/></span><h2>Signed BVB jersey</h2></div>{[['tickets', 'Match tickets'], ['merch', 'Exclusive BVB merchandise']].map(([name, label]) => <div key={name}><Asset name={name}/><h2>{label}</h2></div>)}<p className="fine-print">Illustrative prizes. No real prize draw takes place in this prototype.</p><Button onClick={closePrizes}>BACK TO PRIZES</Button></div></Modal>}
  </>;
}
