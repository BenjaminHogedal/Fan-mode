'use client';
import { motion, useReducedMotion } from 'motion/react';
import { Ticket } from 'lucide-react';
import { useFanModus } from '@/context/FanModusContext';
import { Button, Asset, SectionTop } from '@/components/ui/Primitives';
export { MatchSummary, ThankYou } from './MatchResult';
export function PrizeReveal() {
  const { session, dispatch } = useFanModus();
  const reduced = useReducedMotion();
  const revealed = session.ticketRevealed;
  return <div className="screen prize-reveal"><SectionTop number="09">ONE LAST MATCHDAY MOMENT</SectionTop><h1>YOUR<br/><span>MATCH PRIZE.</span></h1><p aria-live="polite">{revealed ? 'Thanks for being part of FanModus.' : 'Tap the ticket to reveal if you’ve won.'}</p><div className="ticket-perspective"><motion.button aria-label={revealed ? 'No luck today. See you next match!' : 'Tap ticket to reveal your match prize'} aria-pressed={revealed} onClick={() => { if (!revealed) dispatch({ type: 'REVEAL' }); }} className={`prize-ticket ${revealed ? 'revealed' : ''}`} animate={{ rotateY: reduced ? 0 : revealed ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 0.68, 0, 1] }}><div className="ticket-face ticket-front" aria-hidden={revealed} style={reduced && revealed ? { visibility: 'hidden' } : undefined}><div className="ticket-meta"><span>FANMODUS</span><span>MATCHDAY 12</span></div><Asset name="bvb"/><div className="ticket-divider"/><Ticket size={48} strokeWidth={1}/><strong>TAP TO<br/>REVEAL</strong><p>YOUR MOMENT OF TRUTH.</p><div className="ticket-barcode"/><span className="eyebrow">EINMAL BORUSSE. IMMER BORUSSE.</span></div><div className="ticket-face ticket-back" aria-hidden={!revealed} style={reduced ? { transform: 'none', visibility: revealed ? 'visible' : 'hidden' } : undefined}><div className="ticket-meta"><span>FANMODUS</span><span>MATCHDAY 12</span></div><Asset name="bvb"/><div className="ticket-divider"/><strong>NO LUCK<br/>TODAY.</strong><p>The final whistle has blown on this draw.</p><Asset name="stadium"/><h2>SEE YOU NEXT MATCH!</h2><div className="ticket-barcode"/></div></motion.button></div><div className="bottom-actions"><p className="fine-print">Simulated prize reveal · predetermined demo result</p><Button onClick={() => dispatch({ type: 'NAVIGATE', screen: 'menu' })}>BACK TO BVB APP</Button></div></div>;
}
