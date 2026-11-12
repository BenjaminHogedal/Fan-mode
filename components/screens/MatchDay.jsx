'use client';
import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, LockKeyhole, Ticket } from 'lucide-react';
import { useFanModus } from '@/context/FanModusContext';
import { formatTime } from '@/lib/fanmodus';
import { variants } from '@/lib/motion';
import { Button, Eyebrow, Asset, MatchHeader } from '@/components/ui/Primitives';
import DigitalTime from '@/components/ui/DigitalTime';
import AnimatedCounter from '@/components/animations/AnimatedCounter';

export function ActivationProgress() {
  const { dispatch, session } = useFanModus();
  const reduced = useReducedMotion();
  const time = reduced ? 0.3 : variants[session.variant].animationTime;
  useEffect(() => { const id = setTimeout(() => dispatch({ type: 'ACTIVATED' }), time * 1000 + 250); return () => clearTimeout(id); }, [dispatch, time]);
  return <div className="screen centered"><Eyebrow>MAKE EVERY MOMENT COUNT</Eyebrow><div className="progress-ring"><svg viewBox="0 0 220 220" aria-hidden="true"><circle className="ring-track" cx="110" cy="110" r="100"/><motion.circle cx="110" cy="110" r="100" strokeDasharray="628.32" initial={{ strokeDashoffset: 628.32 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: time }}/></svg><div><strong><AnimatedCounter value={100} duration={time}/><small>%</small></strong><span>GETTING MATCH READY</span></div></div><h1 className="medium-title">ACTIVATING<br/><span>FANMODUS</span></h1><p className="fine-print">Staged demo animation</p></div>;
}
export function ActivationSuccess() {
  const { dispatch } = useFanModus();
  useEffect(() => { const id = setTimeout(() => dispatch({ type: 'NAVIGATE', screen: 'kickoff' }), 1800); return () => clearTimeout(id); }, [dispatch]);
  return <div className="screen centered"><motion.div className="success-symbol" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Check size={70}/></motion.div><h1>FANMODUS<br/><span>ACTIVATED.</span></h1><p>You’re in. Now be here.</p><Button onClick={() => dispatch({ type: 'NAVIGATE', screen: 'kickoff' })}>LET’S GO</Button></div>;
}
export function Kickoff({ onLock }) {
  const { session, now } = useFanModus();
  const remaining = Math.max(0, Math.ceil((session.phaseEndsAt - now) / 1000));
  return <div className="screen match-screen"><MatchHeader phase="WESTFALENSTADION · MATCHDAY 12"/><div className="timer-block"><Eyebrow>UNTIL KICK-OFF</Eyebrow><DigitalTime value={formatTime(remaining)}/><h1 className="medium-title">KICK-OFF IS<br/><span>GETTING CLOSER.</span></h1><p>You don’t have to wait until kick-off.<br/>Put your phone away whenever you’re ready.</p></div><Asset name="stadium"/><div className="bottom-actions"><Button onClick={onLock} secondary><LockKeyhole size={18}/> PREVIEW LOCK SCREEN</Button><p className="fine-print">Your entries start counting at kick-off.</p></div></div>;
}
export function ActiveHalf({ onLock }) {
  const { session, seconds } = useFanModus();
  const second = session.matchPhase === 'second';
  return <div className="screen match-screen active-match"><div className="background-chevrons" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i}/>)}</div><MatchHeader phase={second ? 'SECOND HALF' : 'FIRST HALF'}/><div className="timer-block"><Eyebrow>PHONE-FREE TIME</Eyebrow><DigitalTime value={formatTime(seconds)}/></div><button className="lock-preview-link text-button" onClick={onLock}><LockKeyhole size={14}/> LOCK SCREEN PREVIEW</button></div>;
}
export function HalfTime() {
  const { session, now, entries } = useFanModus();
  return <div className="screen halftime-screen"><MatchHeader phase="HALF-TIME"/><div className="halftime-hero"><h1>HALF<br/>TIME</h1><div className="halftime-copy"><h2>FANMODUS PAUSED.</h2><p>YOUR {entries} ENTRIES ARE SAFE.<br/>EARNING RESUMES IN THE SECOND HALF.</p></div><Asset name="stadium"/></div><div className="break-countdown"><Eyebrow>THE SECOND HALF STARTS IN</Eyebrow><DigitalTime value={formatTime(Math.ceil(Math.max(0, session.phaseEndsAt - now) / 1000))}/></div></div>;
}
export function FullTime() {
  const { dispatch, session } = useFanModus();
  const reduced = useReducedMotion();
  useEffect(() => { const id = setTimeout(() => dispatch({ type: 'NAVIGATE', screen: 'collecting' }), reduced ? 1000 : 3000); return () => clearTimeout(id); }, [dispatch, reduced]);
  return <div className="screen centered fulltime-screen"><Eyebrow>THE FINAL WHISTLE</Eyebrow><motion.h1 initial={{ opacity: 0, scale: reduced ? 1 : variants[session.variant].scale }} animate={{ opacity: 1, scale: 1 }}>FULL<br/><span>TIME.</span></motion.h1><MatchHeader phase="BORUSSIA DORTMUND WIN" score/><p>90 minutes. A thousand moments.</p><Button onClick={() => dispatch({ type: 'NAVIGATE', screen: 'collecting' })} secondary>SKIP ANIMATION</Button></div>;
}
export function CollectingEntries() {
  const { dispatch, entries, session } = useFanModus();
  const duration = variants[session.variant].animationTime;
  useEffect(() => { const id = setTimeout(() => dispatch({ type: 'NAVIGATE', screen: 'summary' }), duration * 1000 + 1000); return () => clearTimeout(id); }, [dispatch, duration]);
  return <div className="screen centered collecting-screen"><Eyebrow>EVERY MINUTE MATTERED</Eyebrow><div className="entry-stack" aria-hidden="true">{[0, 1, 2].map(i => <motion.div key={i} initial={{ y: 30, opacity: 0, rotate: 0 }} animate={{ y: 0, opacity: 1, rotate: (i - 1) * 12 }} transition={{ delay: i * 0.1 }}><Ticket size={58}/></motion.div>)}</div><h1 className="medium-title">COLLECTING<br/><span>ENTRIES...</span></h1><strong className="count-total"><AnimatedCounter value={entries} duration={duration}/></strong><p>One completed phone-free minute. One entry.</p><p className="fine-print">Your session total, brought to life. No backend processing.</p><Button secondary onClick={() => dispatch({ type: 'NAVIGATE', screen: 'summary' })}>VIEW RESULT</Button></div>;
}
