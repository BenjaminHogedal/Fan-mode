'use client';
import { useCallback, useState } from 'react';
import { Shirt, Newspaper, Menu, CalendarDays, MessageSquare } from 'lucide-react';
import { useFanModus } from '@/context/FanModusContext';
import { Button } from '@/components/ui/Primitives';
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
