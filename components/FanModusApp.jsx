'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, SlidersHorizontal, Menu, BarChart3 } from 'lucide-react';
import { FanModusProvider, useFanModus } from '@/context/FanModusContext';
import { motionSettings, AUTO_SHARE } from '@/lib/motion';
import { BvbMenu, HowItWorks, Prizes } from './screens/BeforeMatch';
import Intro from './screens/Intro';
import Activation from './screens/Activation';
import { ActivationProgress, ActivationSuccess, Kickoff, ActiveHalf, HalfTime, FullTime, CollectingEntries } from './screens/MatchDay';
import { MatchSummary, ThankYou, PrizeReveal } from './screens/AfterMatch';
import { Button, MatchHeader } from './ui/Primitives';
import LoadingState from './ui/LoadingState';
import ErrorState from './ui/ErrorState';
import Modal from './ui/Modal';
import DesktopViewport, { usePreviewTools } from './ui/DesktopViewport';
import StatusBar from './ui/StatusBar';
import PreviewFit from './ui/PreviewFit';
import ShareSheet from './overlays/ShareSheet';
import DemoControls from './overlays/DemoControls';
import LockScreen from './overlays/LockScreen';
import LocationDialog from './overlays/LocationDialog';

export default function FanModusApp() { return <FanModusProvider><MotionConfig reducedMotion="user"><DesktopViewport><AppContent/></DesktopViewport></MotionConfig></FanModusProvider>; }
function AppContent() {
  const { session, dispatch, ready, storageWarning } = useFanModus();
  const [overlay, setOverlay] = useState(null);
  const [online, setOnline] = useState(true);
  const [networkRetry, setNetworkRetry] = useState(false);
  const toolsHost = usePreviewTools();
  const main = useRef(null);
  const shareOpened = useRef(false);
  const activating = useRef(false);
  const reduced = useReducedMotion();
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openLocation = useCallback(() => setOverlay('location'), []);
  const screen = session.currentScreen;
  const tokens = motionSettings;
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
  function validateActivation() {
    if (!online) { setOverlay('connection'); return false; }
    if (session.locationPermission !== 'granted') { setOverlay('location'); return false; }
    return true;
  }
  function activate() {
    if (activating.current || !validateActivation()) return false;
    activating.current = true;
    dispatch({ type: 'ACTIVATE' });
    return true;
  }
  function allowLocation() { dispatch({ type: 'LOCATION', permission: 'granted' }); closeOverlay(); }
  const screens = {
    menu: <BvbMenu/>, intro: <Intro/>, how: <HowItWorks/>, prizes: <Prizes/>,
    activation: <Activation onLocation={openLocation} onValidate={validateActivation} onActivate={activate}/>,
    activating: <ActivationProgress/>, activated: <ActivationSuccess/>,
    kickoff: <Kickoff onLock={() => setOverlay('lock')}/>, first: <ActiveHalf onLock={() => setOverlay('lock')}/>,
    halftime: <HalfTime/>, second: <ActiveHalf onLock={() => setOverlay('lock')}/>,
    fulltime: <FullTime/>, collecting: <CollectingEntries/>, summary: <MatchSummary/>,
    thanks: <ThankYou onShare={() => setOverlay('share')} onStats={() => setOverlay('stats')}/>, prize: <PrizeReveal/>,
  };
  const canBack = ['intro', 'how', 'prizes', 'activation', 'thanks', 'prize'].includes(screen);
  return <><div className="app-shell" data-screen={screen} data-overlay={Boolean(overlay)}><header className="app-header"><StatusBar tone={['kickoff', 'first', 'halftime', 'second', 'fulltime'].includes(screen) && !overlay ? 'dark' : 'light'}/></header><button className="screen-back icon-button" aria-label={canBack ? 'Go back' : 'Back to BVB menu'} onClick={() => dispatch({ type: canBack ? 'BACK' : 'NAVIGATE', screen: 'menu' })}>{canBack ? <ArrowLeft size={20}/> : <Menu size={20}/>}</button>{storageWarning && <p className="storage-warning" role="status">Session storage is unavailable. Keep this tab open during the demo.</p>}<main id="main" ref={main} tabIndex={-1} aria-label="FanModus experience" inert={overlay ? true : undefined}><PreviewFit><AnimatePresence mode="wait" initial={false}><motion.div className="screen-container" key={ready ? screen : 'loading'} initial={{ opacity: 0, y: reduced ? 0 : tokens.distance }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -tokens.distance / 2 }} transition={{ duration: tokens.duration }}>{ready ? screens[screen] : <LoadingState/>}</motion.div></AnimatePresence></PreviewFit></main>{ready && session.demoMode && toolsHost && createPortal(<button className="demo-toggle" onClick={() => setOverlay('demo')} aria-label="Open demo controls"><SlidersHorizontal size={15}/> DEMO</button>, toolsHost)}<AnimatePresence>{overlay === 'share' && <ShareSheet key="share" onClose={closeOverlay}/>} {overlay === 'demo' && <DemoControls key="demo" onClose={closeOverlay}/>} {overlay === 'lock' && <LockScreen key="lock" onClose={closeOverlay}/>} {overlay === 'location' && <LocationDialog key="location" onClose={closeOverlay} onAllow={allowLocation} onDeny={() => { dispatch({ type: 'LOCATION', permission: 'denied' }); setOverlay('location-error'); }}/>} {['connection', 'activation-error', 'location-error'].includes(overlay) && <Modal key={overlay} title="LET’S GET YOU BACK" onClose={closeOverlay}><ErrorState type={{ connection: 'connection', 'activation-error': 'activation', 'location-error': 'location' }[overlay]} message={overlay === 'connection' && networkRetry ? 'You’re still offline. Reconnect, then try again. Your session is safe.' : null} onClose={closeOverlay} onRetry={() => { if (overlay === 'connection') { if (!navigator.onLine) setNetworkRetry(true); else closeOverlay(); } else if (overlay === 'activation-error' && session.locationPermission === 'granted') { closeOverlay(); dispatch({ type: 'ACTIVATE' }); } else { dispatch({ type: 'NAVIGATE', screen: 'activation' }); setOverlay('location'); } }}/></Modal>} {overlay === 'loading' && <Modal key="loading" title="LOADING PREVIEW" onClose={closeOverlay}><LoadingState/></Modal>} {overlay === 'stats' && <Modal key="stats" title="MATCH STATISTICS" onClose={closeOverlay}><div className="stats-dialog"><BarChart3 size={33}/><MatchHeader phase="FULL TIME · DEMO MATCH" score/><h2>THE MATCH IN NUMBERS</h2>{[['Possession', '54%', '46%'], ['Shots', '16', '11'], ['Shots on target', '7', '4'], ['Corners', '6', '3']].map(([label, home, away]) => <div className="stat-row" key={label}><strong>{home}</strong><span>{label}</span><strong>{away}</strong></div>)}<p className="fine-print">Illustrative match statistics for this prototype.</p><Button onClick={closeOverlay}>BACK TO YOUR MATCHDAY</Button></div></Modal>}</AnimatePresence></div></>;
}
