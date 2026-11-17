'use client';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { animate, motion, useAnimationControls, useMotionValue, useReducedMotion } from 'motion/react';
import { useFanModus } from '@/context/FanModusContext';
import FigmaScreen, { FigmaSvg } from '@/components/ui/FigmaScreen';
import { useSound } from '@/context/SoundContext';
import { playTicketFlip, TICKET_TIMING, WIN_TICKET_TIMING } from '@/lib/ticket-flip';
import styles from './PrizeReveal.module.css';

const anton = localFont({ src: '../../public/fonts/anton.woff2', weight: '400', display: 'swap' });
const inter = localFont({ src: '../../public/fonts/kickoff-inter-variable.woff2', weight: '100 900', display: 'swap' });

function TicketSurface({ back }) {
  return <>
    <div className={`${styles.surface} ${back ? styles.backSurface : ''}`}/>
    <div className={`${styles.texture} ${back ? styles.backTexture : ''}`}>
      <Image src="/images/prize/paper.webp" alt="" width={337.5} height={337.5} priority draggable={false}/>
      <div className={styles.grain}><Image src="/images/prize/texture.png" alt="" fill sizes="517px" priority draggable={false}/></div>
      <div className={styles.border}/>
    </div>
  </>;
}

export default function PrizeReveal({ ref }) {
  const { session, dispatch } = useFanModus();
  const [back, setBack] = useState(session.ticketRevealed);
  const sound = useSound();
  const flipping = useRef(false);
  const lifetime = useRef(null);
  const rotationAnimation = useRef(null);
  const [busy, setBusy] = useState(false);
  const [winner, setWinner] = useState(false);
  const [winReplay, setWinReplay] = useState(0);
  const celebration = useAnimationControls();
  const victoryLights = useAnimationControls();
  const reduced = useReducedMotion();
  const lift = useAnimationControls();
  const atmosphere = useAnimationControls();
  const pulse = useAnimationControls();
  const sheen = useAnimationControls();
  const rotation = useMotionValue(session.ticketRevealed ? 180 : 0);
  const revealed = session.ticketRevealed;

  useEffect(() => () => {
    lifetime.current?.abort();
    rotationAnimation.current?.stop();
    lift.stop(); atmosphere.stop(); pulse.stop(); sheen.stop(); celebration.stop(); victoryLights.stop();
  }, [session.currentScreen, lift, atmosphere, pulse, sheen, celebration, victoryLights]);

  useImperativeHandle(ref, () => ({ showWinner: () => flip(true) }));

  async function flip(demoWinner = false) {
    if (flipping.current || session.currentScreen !== 'prize') return;
    flipping.current = true;
    setBusy(true);
    const controller = new AbortController();
    lifetime.current = controller;
    const nextBack = demoWinner ? true : !back;
    const winningReveal = nextBack && (demoWinner || winner);
    const timing = winningReveal ? WIN_TICKET_TIMING : TICKET_TIMING;
    // Normalize complete revolutions without changing the visible face.
    const from = back ? 180 : 0;
    rotation.set(from);
    const target = winningReveal ? 540 : nextBack ? 180 : 0;
    const direction = nextBack ? 1 : -1;
    void sound.unlock();
    try {
      await playTicketFlip({
        signal: controller.signal,
        reduced: Boolean(reduced),
        timing,
        anticipate: () => lift.start({
          y: winningReveal ? -30 : -20, z: winningReveal ? 65 : 42, rotateX: 11, rotateZ: -2.5 * direction,
          transition: { duration: timing.anticipation, ease: [0.2, 0.8, 0.2, 1] },
        }),
        sound: () => { void sound.play('ticket', { restart: true, duration: winningReveal ? 1.2 : 0.95 }); },
        turn: () => {
          void lift.start({ y: winningReveal ? -36 : -27, z: winningReveal ? 90 : 64, rotateX: -6, rotateZ: 1.5 * direction, transition: { duration: timing.turn, ease: 'easeInOut' } });
          rotationAnimation.current = animate(rotation, [from, from - 9 * direction, target + (winningReveal ? 14 : 7) * direction, target], {
            duration: timing.turn, times: [0, 0.1, 0.83, 1], ease: [0.45, 0, 0.15, 1],
          });
          void sheen.start({ x: ['-130%', '130%'], opacity: [0, 0.5, 0], transition: { duration: 0.58, times: [0, 0.5, 1], ease: 'easeInOut' } });
          return rotationAnimation.current;
        },
        reveal: () => {
          setBack(nextBack);
          if (demoWinner) setWinner(true);
          if (winningReveal) setWinReplay(value => value + 1);
          if (winningReveal) void sound.play('crowd', { restart: true });
          if (reduced) rotation.set(target);
          if (nextBack && !revealed) dispatch({ type: 'REVEAL' });
        },
        impact: () => {
          if (winningReveal) {
            void celebration.start('burst');
            void victoryLights.start({ opacity: [0, 0.95, 0.65, 0], scale: [0.7, 1, 1.12, 1.18], rotate: [0, 4, -3, 0], transition: { duration: 2.1, times: [0, 0.16, 0.65, 1], ease: 'easeOut' } });
          }
          void atmosphere.start({ opacity: [0, winningReveal ? 1 : 0.65, 0], scale: [0.85, 1.06, 1.12], transition: { duration: 0.65, times: [0, 0.25, 1] } });
          void pulse.start({ opacity: [0, winningReveal ? 0.85 : 0.45, 0], scale: [0.9, 1.18, 1.3], transition: { duration: 0.6, times: [0, 0.2, 1], ease: 'easeOut' } });
        },
        land: () => lift.start({ y: 0, z: 0, rotateX: 0, rotateZ: 0, transition: { type: 'spring', duration: timing.landing, bounce: winningReveal ? 0.28 : 0.18 } }),
      });
    } finally {
      if (!controller.signal.aborted) {
        flipping.current = false;
        setBusy(false);
      }
    }
  }
  return <FigmaScreen nodeId={revealed ? '573:812' : '456:1903'} label="Your match prize">
    {winner && back && <motion.div className={styles.victoryBackdrop} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.45 }}/>}
    <motion.div className={styles.victoryLights} aria-hidden="true" initial={false} style={{ opacity: 0 }} animate={victoryLights}><span/><span/><span/><span/><span/></motion.div>
    <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 32 }, (_, i) => <motion.i key={i} custom={i} initial={false} style={{ opacity: 0 }} animate={celebration} variants={{ burst: index => {
      const side = index % 2 ? 1 : -1;
      const reach = 55 + (index * 37 % 140);
      return { x: [0, side * reach * 0.6, side * reach * 0.85, side * reach], y: [0, -100 - index * 19 % 180, -30, 130 + index * 11 % 100], rotate: [0, side * 90, side * 200, side * (240 + index * 29)], scale: [0.4, 1, 0.9, 0.6], opacity: [0, 1, 1, 0], transition: { duration: 1.6 + index % 4 * 0.12, delay: index % 7 * 0.018, times: [0, 0.3, 0.78, 1], ease: 'easeOut' } };
    } }}/>)}</div>
    <div className={styles.club}><Image src="/images/post-match/bvb.webp" alt="Borussia Dortmund" width={93} height={93} priority/></div>
    {winner && back ? <motion.h1 key={`heading-${winReplay}`} className={`${styles.victoryHeadline} ${anton.className}`} initial={reduced ? false : { opacity: 0, y: 18, scale: 1.2, rotate: -6 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: -3 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}>YOU WON<span aria-hidden="true">.</span></motion.h1> : <h1 className={styles.title}>your match prize</h1>}
    {!revealed && <p className={`${styles.instructions} ${inter.className}`}>Tap the ticket to reveal<br/>if you’ve won.</p>}
    <div className={styles.scene} data-flipping={busy} data-winner={winner}>
      <motion.div className={styles.atmosphere} aria-hidden="true" initial={false} style={{ opacity: 0 }} animate={atmosphere}><span/><span/><span/></motion.div>
      <motion.div className={styles.impactRing} aria-hidden="true" initial={false} style={{ opacity: 0 }} animate={pulse}/>
      <motion.div className={styles.lift} initial={false} animate={lift}>
      <motion.button type="button" className={styles.rotator} onClick={() => flip()} aria-disabled={busy} aria-busy={busy} aria-pressed={back} aria-label={back ? 'Turn ticket back to the front' : 'Turn ticket over to reveal your match prize'}
        initial={false} style={{ rotateY: reduced ? 0 : rotation }}>
        <div className={`${styles.face} ${styles.front}`} aria-hidden={back} style={reduced && back ? { visibility: 'hidden' } : undefined}>
          <TicketSurface/>
          <div className={styles.sheenClip} aria-hidden="true"><motion.div className={styles.sheen} initial={false} style={{ opacity: 0, x: '-130%' }} animate={sheen}/></div>
          <div className={styles.frontClub}><Image src="/images/prize/club.png" alt="" fill sizes="90px" priority draggable={false}/></div>
          <p className={styles.tapTitle}>Tap to reveal</p>
          <div className={styles.frontStripeTop}><FigmaSvg src="/images/prize/stripe-front.svg"/></div>
          <div className={styles.frontStripeBottom}><FigmaSvg src="/images/prize/stripe-front.svg"/></div>
          <div className={styles.frontCutouts}><FigmaSvg src="/images/prize/cutouts-front.svg"/></div>
        </div>
        <div className={`${styles.face} ${styles.back}`} aria-hidden={!back} style={reduced ? { transform: 'none', visibility: back ? 'visible' : 'hidden' } : undefined}>
          {winner ? <div className={styles.prizeShowcase}>
            <div className={styles.prizePanel}/>
            <span className={styles.prizeNumber} aria-hidden="true">09</span>
            <div className={styles.prizeTopline}><span>EXCLUSIVE</span><span>BVB 09</span></div>
            <div className={styles.prizeHalo} aria-hidden="true"/>
            <motion.div key={`jersey-${winReplay}`} className={styles.prizeJersey} initial={reduced ? false : { opacity: 0, y: 35, scale: 0.65, rotate: 8 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: -9 }} transition={{ type: 'spring', duration: 0.65, bounce: 0.25, delay: reduced ? 0 : 0.1 }}>
              <Image src="/images/onboarding/signed-jersey.webp" alt="Your prize: a signed Borussia Dortmund jersey" fill sizes="270px" priority draggable={false}/>
            </motion.div>
            <div className={styles.prizeFooter}><span>Signed</span><strong>BVB JERSEY</strong><span className={styles.prizeStar} aria-hidden="true">★</span></div>
            <div className={styles.sheenClip} aria-hidden="true"><motion.div className={styles.sheen} initial={false} style={{ opacity: 0, x: '-130%' }} animate={sheen}/></div>
          </div> : <>
            <TicketSurface back/>
            <div className={styles.sheenClip} aria-hidden="true"><motion.div className={styles.sheen} initial={false} style={{ opacity: 0, x: '-130%' }} animate={sheen}/></div>
            <div className={styles.backStripe}><FigmaSvg src="/images/prize/stripe-back.svg"/></div>
            <div className={styles.backCutouts}><FigmaSvg src="/images/prize/cutouts-back.svg"/></div>
            <div className={styles.backClub}><Image src="/images/prize/club.png" alt="" fill sizes="45px" priority draggable={false}/></div>
            <p className={`${styles.noLuck} ${anton.className}`}>NO LUCK<br/>TODAY.</p>
            <p className={styles.explanation}>The final whistle has blown on this<br/>draw.</p>
            <div className={styles.stadium}><FigmaSvg src="/images/prize/line.svg"/><Image src="/images/prize/stadium.webp" alt="" width={65.909} height={36} priority draggable={false}/><FigmaSvg src="/images/prize/line.svg"/></div>
            <p className={`${styles.nextMatch} ${inter.className}`}>See you next match!</p>
          </>}
        </div>
      </motion.button>
      </motion.div>
    </div>
    {revealed && <motion.button type="button" className={styles.home} aria-disabled={busy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.25 }} onClick={() => { if (!flipping.current) dispatch({ type: 'NAVIGATE', screen: 'menu' }); }}><FigmaSvg src="/images/prize/home.svg"/><span>Back to BVB app</span></motion.button>}
    <p className={styles.srOnly} role="status">{busy ? 'Turning your match ticket.' : back && winner ? 'You won a signed BVB jersey.' : back ? 'No luck today. The final whistle has blown on this draw. See you next match!' : revealed ? 'Front of ticket. Tap to turn it over again.' : 'Tap the ticket to reveal if you’ve won.'}</p>
  </FigmaScreen>;
}
