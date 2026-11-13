'use client';
import { useState } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { motion, useReducedMotion } from 'motion/react';
import { useFanModus } from '@/context/FanModusContext';
import FigmaScreen, { FigmaSvg } from '@/components/ui/FigmaScreen';
import styles from './PrizeReveal.module.css';

const anton = localFont({ src: '../../public/fonts/anton.ttf', weight: '400', display: 'swap' });
const inter = localFont({ src: '../../public/fonts/kickoff-inter-variable.ttf', weight: '100 900', display: 'swap' });

function TicketSurface({ back }) {
  return <>
    <div className={`${styles.surface} ${back ? styles.backSurface : ''}`}/>
    <div className={`${styles.texture} ${back ? styles.backTexture : ''}`}>
      <Image src="/images/prize/paper.png" alt="" width={337.5} height={337.5} priority draggable={false}/>
      <div className={styles.grain}><Image src="/images/prize/texture.png" alt="" fill sizes="517px" priority draggable={false}/></div>
      <div className={styles.border}/>
    </div>
  </>;
}

export default function PrizeReveal() {
  const { session, dispatch } = useFanModus();
  const [back, setBack] = useState(session.ticketRevealed);
  const reduced = useReducedMotion();
  const revealed = session.ticketRevealed;
  function flip() {
    setBack(value => !value);
    if (!revealed) dispatch({ type: 'REVEAL' });
  }
  return <FigmaScreen nodeId={revealed ? '573:812' : '456:1903'} label="Your match prize">
    <div className={styles.club}><Image src="/images/post-match/bvb.png" alt="Borussia Dortmund" width={93} height={93} priority/></div>
    <h1 className={styles.title}>your match prize</h1>
    {!revealed && <p className={`${styles.instructions} ${inter.className}`}>Tap the ticket to reveal<br/>if you’ve won.</p>}
    <div className={styles.scene}>
      <motion.button type="button" className={styles.rotator} onClick={flip} aria-pressed={back} aria-label={back ? 'Turn ticket back to the front' : 'Turn ticket over to reveal your match prize'}
        initial={false} animate={{ rotateY: reduced ? 0 : back ? 180 : 0, y: reduced ? 0 : [0, -12, 0], scale: reduced ? 1 : [1, 1.025, 1] }}
        transition={{ duration: reduced ? 0 : 0.5, ease: 'easeInOut' }}>
        <div className={`${styles.face} ${styles.front}`} aria-hidden={back} style={reduced && back ? { visibility: 'hidden' } : undefined}>
          <TicketSurface/>
          <div className={styles.frontClub}><Image src="/images/prize/club.png" alt="" fill sizes="90px" priority draggable={false}/></div>
          <p className={styles.tapTitle}>Tap to reveal</p>
          <div className={styles.frontStripeTop}><FigmaSvg src="/images/prize/stripe-front.svg"/></div>
          <div className={styles.frontStripeBottom}><FigmaSvg src="/images/prize/stripe-front.svg"/></div>
          <div className={styles.frontCutouts}><FigmaSvg src="/images/prize/cutouts-front.svg"/></div>
        </div>
        <div className={`${styles.face} ${styles.back}`} aria-hidden={!back} style={reduced ? { transform: 'none', visibility: back ? 'visible' : 'hidden' } : undefined}>
          <TicketSurface back/>
          <div className={styles.backStripe}><FigmaSvg src="/images/prize/stripe-back.svg"/></div>
          <div className={styles.backCutouts}><FigmaSvg src="/images/prize/cutouts-back.svg"/></div>
          <div className={styles.backClub}><Image src="/images/prize/club.png" alt="" fill sizes="45px" priority draggable={false}/></div>
          <p className={`${styles.noLuck} ${anton.className}`}>NO LUCK<br/>TODAY.</p>
          <p className={styles.explanation}>The final whistle has blown on this<br/>draw.</p>
          <div className={styles.stadium}><FigmaSvg src="/images/prize/line.svg"/><Image src="/images/prize/stadium.png" alt="" width={65.909} height={36} priority draggable={false}/><FigmaSvg src="/images/prize/line.svg"/></div>
          <p className={`${styles.nextMatch} ${inter.className}`}>See you next match!</p>
        </div>
      </motion.button>
    </div>
    {revealed && <motion.button type="button" className={styles.home} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.25 }} onClick={() => dispatch({ type: 'NAVIGATE', screen: 'menu' })}><FigmaSvg src="/images/prize/home.svg"/><span>Back to BVB app</span></motion.button>}
    <p className={styles.srOnly} role="status">{back ? 'No luck today. The final whistle has blown on this draw. See you next match!' : revealed ? 'Front of ticket. Tap to turn it over again.' : 'Tap the ticket to reveal if you’ve won.'}</p>
  </FigmaScreen>;
}
