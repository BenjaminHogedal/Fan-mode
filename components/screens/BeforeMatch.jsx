'use client';
import { ArrowUpRight, Smartphone, MapPin, Ticket, ChevronRight, Trophy, Newspaper, Users, ShoppingBag } from 'lucide-react';
import { useFanModus } from '@/context/FanModusContext';
import { Button, Asset, Eyebrow, StepDots, SectionTop, MatchHeader } from '@/components/ui/Primitives';
import SwipeToActivate from '@/components/animations/SwipeToActivate';

export function BvbMenu() {
  const { dispatch, session } = useFanModus();
  const active = session.fanModusStatus === 'active';
  return <div className="screen menu-screen"><div className="menu-welcome"><Eyebrow>BLACK. YELLOW. TOGETHER.</Eyebrow><h1>HEJA<br/><span>BVB.</span></h1><Asset name="stadium" /><span className="venue-label">DORTMUND, OUR HOME.</span></div><button className="fanmodus-entry" onClick={() => dispatch({ type: 'NAVIGATE', screen: active ? (session.matchPhase === 'pre-match' ? 'kickoff' : session.matchPhase) : 'intro' })}><div className="entry-icon"><Smartphone size={26} /><span className="cross-stroke" /></div><div><span className="eyebrow">YOUR MATCHDAY. MORE REAL.</span><strong>FanModus</strong><p>{active ? 'Your session is active. Jump back in.' : 'Less scrolling. More Südtribüne.'}</p></div><ArrowUpRight size={27} /></button><div className="menu-section"><SectionTop number="09">THE BLACK & YELLOW WORLD</SectionTop>{[[Newspaper, 'Match centre', 'match'], [Trophy, 'Fan rewards', 'prizes'], [Users, 'The FanModus idea', 'intro'], [ShoppingBag, 'Matchday collection', 'prizes']].map(([Icon, name, screen]) => <button className="menu-row" key={name} onClick={() => dispatch({ type: 'NAVIGATE', screen: screen === 'match' ? 'intro' : screen })}><Icon size={20} /><span>{name}</span><ChevronRight size={18} /></button>)}</div><p className="prototype-note">AN INDEPENDENT FAN EXPERIENCE · EXAM PROTOTYPE</p></div>;
}
export function Intro() {
  const { dispatch } = useFanModus();
  return <div className="screen intro-screen"><div><SectionTop number="01 / 04">WELCOME TO FANMODUS</SectionTop><h1>THE BEST<br/>MOMENTS<br/>AREN’T ON<br/><span className="brush-highlight">YOUR PHONE.</span></h1><p className="intro-copy">90 minutes. One yellow wall.<br/>Be part of every second.</p></div><div className="intro-graphic" aria-hidden="true"><span>09</span><div className="phone-outline"><Smartphone strokeWidth={1} size={68}/><div /></div><span className="graphic-caption">BE HERE.<br/>BE BORUSSIA.</span></div><div className="bottom-actions"><p>Put your phone away. Feel the match.<br/>Earn entries for exclusive BVB prizes.</p><Button onClick={() => dispatch({ type: 'NAVIGATE', screen: 'how' })}>GET STARTED</Button><StepDots step={1}/></div></div>;
}
export function HowItWorks() {
  const { dispatch } = useFanModus();
  const steps = [[MapPin, 'ACTIVATE FANMODUS', 'Activate FanModus at Westfalenstadion.'], [Smartphone, 'PUT YOUR PHONE AWAY', 'Keep your phone in your pocket and enjoy the match.'], [Ticket, 'EARN ENTRIES', 'Earn one entry for every completed phone-free minute.']];
  return <div className="screen"><SectionTop number="02 / 04">A BETTER MATCHDAY</SectionTop><h1>LESS PHONE.<br/><span>MORE GAME.</span></h1><p>Three steps. A whole different feeling.</p><div className="steps">{steps.map(([Icon, title, text], i) => <div className="step" key={title}><span className="step-number">0{i + 1}</span><div><Icon size={28}/><h2>{title}</h2><p>{text}</p></div></div>)}</div><div className="bottom-actions"><Button onClick={() => dispatch({ type: 'NAVIGATE', screen: 'prizes' })}>EXPLORE THE REWARDS</Button><StepDots step={2}/></div></div>;
}
export function Prizes() {
  const { dispatch } = useFanModus();
  return <div className="screen"><SectionTop number="03 / 04">PRESENCE HAS ITS REWARDS</SectionTop><h1>REAL MOMENTS.<br/><span>REAL REWARDS.</span></h1><p>More phone-free minutes.<br/>More chances to win.</p><div className="prize-grid"><div className="prize-feature"><span className="prize-tag">THE MATCHDAY HEADLINER</span><Asset name="jersey"/><h2>SIGNED BVB JERSEY</h2><p>Something to keep. A moment to remember.</p></div><div className="prize-small"><Asset name="tickets"/><h2>MATCH TICKETS</h2></div><div className="prize-small"><Asset name="merch"/><h2>EXCLUSIVE MERCH</h2></div></div><div className="bottom-actions"><p className="fine-print">Illustrative rewards. No real prize draw in this prototype.</p><Button onClick={() => dispatch({ type: 'NAVIGATE', screen: 'activation' })}>GET MATCH READY</Button><StepDots step={3}/></div></div>;
}
export function Activation({ onLocation, onActivate }) {
  const { session } = useFanModus();
  const allowed = session.locationPermission === 'granted';
  return <div className="screen activation-screen"><SectionTop number="04 / 04">READY WHEN YOU ARE</SectionTop><h1>YOUR PHONE<br/>CAN WAIT.<br/><span>THE WALL CAN’T.</span></h1><div className="entry-rule"><span>1</span><div>PHONE-FREE MINUTE<br/><strong>= 1 ENTRY</strong></div><Ticket size={33}/></div><MatchHeader/><button className={`location-check ${allowed ? 'verified' : ''}`} onClick={onLocation}><MapPin size={20}/><div><strong>{allowed ? 'STADIUM LOCATION CONFIRMED' : 'CONFIRM YOUR LOCATION'}</strong><span>{allowed ? 'Westfalenstadion · simulated check' : 'Activate at Westfalenstadion'}</span></div><ChevronRight size={18}/></button><div className="bottom-actions">{!allowed && <Button onClick={onLocation}>ENABLE LOCATION</Button>}<SwipeToActivate disabled={!allowed} onActivate={onActivate}/><p className="fine-print">Demo experience. Location and phone-free tracking are simulated. Your device use is never monitored.</p><StepDots step={4}/></div></div>;
}
