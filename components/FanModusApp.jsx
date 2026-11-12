'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, SlidersHorizontal, MapPin, Menu, BarChart3 } from 'lucide-react';
import { FanModusProvider, useFanModus } from '@/context/FanModusContext';
import { variants, AUTO_SHARE } from '@/lib/motion';
import { BvbMenu, Intro, HowItWorks, Prizes, Activation } from './screens/BeforeMatch';
import { ActivationProgress, ActivationSuccess, Kickoff, ActiveHalf, HalfTime, FullTime, CollectingEntries } from './screens/MatchDay';
import { MatchSummary, ThankYou, PrizeReveal } from './screens/AfterMatch';
import { Asset, Button, Eyebrow, MatchHeader } from './ui/Primitives';
import LoadingState from './ui/LoadingState';
import ErrorState from './ui/ErrorState';
import Modal from './ui/Modal';
import DesktopViewport from './ui/DesktopViewport';
import PreviewFit from './ui/PreviewFit';
import ShareSheet from './overlays/ShareSheet';
import DemoControls from './overlays/DemoControls';
import LockScreen from './overlays/LockScreen';

export default function FanModusApp() { return <FanModusProvider><MotionConfig reducedMotion="user"><DesktopViewport><AppContent/></DesktopViewport></MotionConfig></FanModusProvider>; }
function AppContent() {
  const { session, dispatch, ready, storageWarning } = useFanModus();
  const [overlay, setOverlay] = useState(null);
  const [online, setOnline] = useState(true);
  const [networkRetry, setNetworkRetry] = useState(false);
  const main = useRef(null);
  const shareOpened = useRef(false);
  const activating = useRef(false);
  const reduced = useReducedMotion();
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openOverlay = useCallback(name => setOverlay(name), []);
  const screen = session.currentScreen;
  const tokens = variants[session.variant];
  useEffect(() => {
    const offline = () => { setOnline(false); setOverlay('connection'); };
    const online = () => { setOnline(true); setNetworkRetry(false); };
    window.addEventListener('offline', offline); window.addEventListener('online', online);
    if (!navigator.onLine) offline();
    return () => { window.removeEventListener('offline', offline); window.removeEventListener('online', online); };
  }, []);
  useEffect(() => {
    if (ready) { main.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
    if (screen !== 'activating') activating.current = false;
    if (screen !== 'thanks') shareOpened.current = false;
    if (screen === 'thanks' && AUTO_SHARE && session.demoMode && !shareOpened.current) {
      const id = setTimeout(() => { setOverlay('share'); shareOpened.current = true; }, 900);
      return () => clearTimeout(id);
    }
  }, [screen, ready, session.demoMode]);
  useEffect(() => {
    if (overlay !== 'loading') return;
    const id = setTimeout(() => setOverlay(null), 6500);
    return () => clearTimeout(id);
  }, [overlay]);
  function activate() {
    if (activating.current) return false;
    if (!online) { setOverlay('connection'); return false; }
    if (session.locationPermission !== 'granted') { setOverlay('location'); return false; }
    activating.current = true; dispatch({ type: 'ACTIVATE' }); return true;
  }
  function allowLocation() { dispatch({ type: 'LOCATION', permission: 'granted' }); closeOverlay(); }
  const screens = {
    menu: <BvbMenu/>, intro: <Intro/>, how: <HowItWorks/>, prizes: <Prizes/>,
    activation: <Activation onLocation={() => setOverlay('location')} onActivate={activate}/>,
    activating: <ActivationProgress/>, activated: <ActivationSuccess/>,
    kickoff: <Kickoff onLock={() => setOverlay('lock')}/>, first: <ActiveHalf onLock={() => setOverlay('lock')}/>,
    halftime: <HalfTime/>, second: <ActiveHalf onLock={() => setOverlay('lock')}/>,
    fulltime: <FullTime/>, collecting: <CollectingEntries/>, summary: <MatchSummary/>,
    thanks: <ThankYou onShare={() => setOverlay('share')} onStats={() => setOverlay('stats')}/>, prize: <PrizeReveal/>,
  };
  const canBack = ['intro', 'how', 'prizes', 'activation', 'thanks', 'prize'].includes(screen);
  return <><div className="desktop-caption" aria-hidden="true"><span>09 / A MORE PRESENT MATCHDAY</span><strong>BE HERE.<br/>BE BORUSSIA.</strong><span>FANMODUS — INTERACTIVE PROTOTYPE</span></div><div className="app-shell" data-variant={session.variant}><a className="skip-link" href="#main">Skip to content</a><header className="app-header"><button className="icon-button" aria-label={canBack ? 'Go back' : 'Back to BVB menu'} onClick={() => dispatch({ type: canBack ? 'BACK' : 'NAVIGATE', screen: 'menu' })}>{canBack ? <ArrowLeft size={22}/> : <Menu size={22}/>}</button><div className="wordmark">{screen === 'menu' ? <Asset name="bvb"/> : <>FAN<span>MODUS</span><i/></>}</div><span className="header-detail">{screen === 'menu' ? 'EST. 1909' : 'BVB 09'}</span></header>{storageWarning && <p className="storage-warning" role="status">Session storage is unavailable. Keep this tab open during the demo.</p>}<main id="main" ref={main} tabIndex={-1} aria-label="FanModus experience" inert={overlay ? true : undefined}><PreviewFit><AnimatePresence mode="wait" initial={false}><motion.div className="screen-container" key={ready ? screen : 'loading'} initial={{ opacity: 0, y: reduced ? 0 : tokens.distance }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -tokens.distance / 2 }} transition={{ duration: tokens.duration }}>{ready ? screens[screen] : <LoadingState/>}</motion.div></AnimatePresence></PreviewFit></main><footer className="app-footer"><span>ECHTE LIEBE. ECHTE MOMENTE.</span><span className="footer-stripes" aria-hidden="true"/></footer>{ready && session.demoMode && <button className="demo-toggle" onClick={() => setOverlay('demo')} aria-label="Open demo controls"><SlidersHorizontal size={14}/> DEMO</button>}<AnimatePresence>{overlay === 'share' && <ShareSheet key="share" onClose={closeOverlay}/>} {overlay === 'demo' && <DemoControls key="demo" onClose={closeOverlay} openOverlay={openOverlay}/>} {overlay === 'lock' && <LockScreen key="lock" onClose={closeOverlay}/>} {overlay === 'location' && <Modal key="location" title="STADIUM CHECK" onClose={closeOverlay}><div className="location-dialog"><MapPin size={48} strokeWidth={1}/><Eyebrow>THIS IS WHERE IT BEGINS</Eyebrow><h1 className="medium-title">ENABLE<br/><span>LOCATION.</span></h1><p>We use your location to check that you’re at the stadium.</p><p className="demo-disclosure">PROTOTYPE MODE<br/>This button simulates being at Westfalenstadion. No GPS permission is requested.</p><Button onClick={allowLocation}>ALLOW LOCATION</Button><button className="text-button" onClick={() => { dispatch({ type: 'LOCATION', permission: 'denied' }); setOverlay('location-error'); }}>NOT NOW</button></div></Modal>} {['connection', 'activation-error', 'location-error'].includes(overlay) && <Modal key={overlay} title="LET’S GET YOU BACK" onClose={closeOverlay}><ErrorState type={{ connection: 'connection', 'activation-error': 'activation', 'location-error': 'location' }[overlay]} message={overlay === 'connection' && networkRetry ? 'You’re still offline. Reconnect, then try again. Your session is safe.' : null} onClose={closeOverlay} onRetry={() => { if (overlay === 'connection') { if (!navigator.onLine) setNetworkRetry(true); else closeOverlay(); } else if (overlay === 'activation-error' && session.locationPermission === 'granted') { closeOverlay(); dispatch({ type: 'ACTIVATE' }); } else { dispatch({ type: 'NAVIGATE', screen: 'activation' }); setOverlay('location'); } }}/></Modal>} {overlay === 'loading' && <Modal key="loading" title="LOADING PREVIEW" onClose={closeOverlay}><LoadingState/></Modal>} {overlay === 'stats' && <Modal key="stats" title="MATCH STATISTICS" onClose={closeOverlay}><div className="stats-dialog"><BarChart3 size={33}/><MatchHeader phase="FULL TIME · DEMO MATCH" score/><h2>THE MATCH IN NUMBERS</h2>{[['Possession', '54%', '46%'], ['Shots', '16', '11'], ['Shots on target', '7', '4'], ['Corners', '6', '3']].map(([label, home, away]) => <div className="stat-row" key={label}><strong>{home}</strong><span>{label}</span><strong>{away}</strong></div>)}<p className="fine-print">Illustrative match statistics for this prototype.</p><Button onClick={closeOverlay}>BACK TO YOUR MATCHDAY</Button></div></Modal>}</AnimatePresence></div></>;
}
