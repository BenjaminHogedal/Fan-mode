'use client';
import { useCallback, useState } from 'react';
import { ArrowRight, Ticket, Shirt, Newspaper, Menu, CalendarDays, MessageSquare, Ellipsis, ShoppingBag, Crown } from 'lucide-react';
import { useFanModus } from '@/context/FanModusContext';
import { Button, Asset } from '@/components/ui/Primitives';
import Modal from '@/components/ui/Modal';
import MatchdayMatchup from '@/components/ui/MatchdayMatchup';
import FanModusWordmark from '@/components/ui/FanModusWordmark';

function PhoneAwayIcon() {
  return <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="1.5"/><path d="M10 5h4m-3 14h2M3 2l18 20"/></svg>;
}

export function BvbMenu() {
  const { dispatch, session } = useFanModus();
  const [preview, setPreview] = useState(null);
  const closePreview = useCallback(() => setPreview(null), []);
  const active = session.fanModusStatus === 'active';
  const enterFanModus = () => dispatch({ type: 'NAVIGATE', screen: active ? (session.matchPhase === 'pre-match' ? 'kickoff' : session.matchPhase) : 'intro' });
  const tabs = [[Newspaper, 'News'], [Shirt, 'Squad'], [CalendarDays, 'Fixtures'], [Shirt, 'My BVB'], [Menu, 'More']];
  return <div className="screen menu-screen matchday-menu">
    <MatchdayMatchup/>
    <h1>MATCHDAY<br/>GAMES</h1>
    <div className="matchday-tiles">
      <button onClick={() => setPreview('Starting XI prediction')}><Shirt size={34}/><span>Starting XI prediction</span></button>
      <button onClick={() => setPreview('Match polls')}><MessageSquare size={34}/><span>Match polls</span></button>
      <button className="fanmodus-tile" onClick={enterFanModus}><PhoneAwayIcon/><FanModusWordmark/><span>{active ? 'Resume FanModus' : 'FanModus'}</span></button>
    </div>
    <nav className="bvb-tab-bar" aria-label="BVB app navigation">{tabs.map(([Icon, label]) => <button key={label} aria-current={label === 'Fixtures' ? 'page' : undefined} onClick={() => label === 'Fixtures' ? setPreview(null) : setPreview(label)}><Icon size={26}/><span>{label}</span></button>)}<span className="ios-home-indicator" aria-hidden="true"/></nav>
    {preview && <Modal title={preview} onClose={closePreview}><div className="menu-feature-preview"><h2>{preview}</h2><p>This part of the BVB app is a placeholder in this prototype. Explore the complete FanModus matchday experience.</p><Button onClick={enterFanModus}>OPEN FANMODUS</Button><button className="text-button" onClick={() => setPreview(null)}>BACK TO MATCHDAY</button></div></Modal>}
  </div>;
}

export function HowItWorks() {
  const { dispatch } = useFanModus();
  const steps = [['ACTIVATE', 'AT THE STADIUM', 'Turn on FanModus when you are at Westfalenstadion.'], ['KEEP IT AWAY', null, 'Leave your phone in your pocket.'], ['COLLECT ENTRIES', null, 'Earn entries for every phone-free minute.']];
  return <div className="screen how-screen">
    <Asset name="stand" className="scene-backdrop"/><FanModusWordmark/>
    <div className="how-title"><h1>HOW IT<br/>WORKS</h1><div className="scribble-underline" aria-hidden="true"/></div>
    <div className="reference-steps">{steps.map(([title, secondLine, text], i) => <div className="reference-step" key={title}><span className="circled-step">{i + 1}</span><div><h2><span>{title}</span>{secondLine && <span>{secondLine}</span>}</h2><p>{text}</p></div></div>)}</div>
    <div className="bottom-actions"><button className="paper-button arrow-paper" aria-label="Continue to prizes" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'prizes' })}><ArrowRight size={108} strokeWidth={1}/></button></div>
  </div>;
}

export function Prizes() {
  const { dispatch } = useFanModus();
  const [allPrizes, setAllPrizes] = useState(false);
  const closePrizes = useCallback(() => setAllPrizes(false), []);
  return <div className="screen prizes-screen">
    <FanModusWordmark/>
    <div className="prizes-title"><Crown size={57} strokeWidth={1.7} aria-hidden="true"/><h1>WIN PRIZES</h1></div>
    <p className="prize-intro">The longer you stay phone-free,<br/>the higher your chance of winning.</p>
    <div className="jersey-hero"><Asset name="jersey"/><span className="jersey-caption">SIGNED<br/>JERSEY</span></div>
    <div className="reward-categories"><div><Ticket size={24}/><span>Match<br/>tickets</span></div><div><ShoppingBag size={24}/><span>BVB<br/>merch</span></div><div><Ellipsis size={26}/><span>And more</span></div></div>
    <button className="text-button all-prizes-button" onClick={() => setAllPrizes(true)}>SEE ALL PRIZES</button>
    <div className="bottom-actions"><button className="editorial-cta" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'activation' })}>GET MATCH READY <ArrowRight size={35}/></button></div>
    {allPrizes && <Modal title="MATCHDAY REWARDS" onClose={closePrizes}><div className="all-prizes-list">{[['jersey', 'Signed BVB jersey'], ['tickets', 'Match tickets'], ['merch', 'Exclusive BVB merchandise']].map(([name, label]) => <div key={name}><Asset name={name}/><h2>{label}</h2></div>)}<p className="fine-print">Illustrative prizes. No real prize draw takes place in this prototype.</p><Button onClick={() => setAllPrizes(false)}>BACK TO PRIZES</Button></div></Modal>}
  </div>;
}
