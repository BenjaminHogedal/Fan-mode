'use client';
import Modal from '@/components/ui/Modal';
import { useFanModus } from '@/context/FanModusContext';
import { FLOW, STORAGE_KEY } from '@/lib/fanmodus';
export default function DemoControls({ onClose, openOverlay }) {
  const { session, dispatch } = useFanModus();
  function act(callback) { callback(); onClose(); }
  const jump = (phase) => act(() => dispatch({ type: 'DEMO_JUMP', phase }));
  function goToScreen(screen) {
    if (['first', 'halftime', 'second', 'fulltime'].includes(screen)) jump(screen === 'fulltime' ? 'finished' : screen);
    else if (screen === 'activating' || screen === 'activated' || screen === 'kickoff') act(() => { dispatch({ type: 'LOCATION', permission: 'granted' }); dispatch({ type: 'ACTIVATED' }); dispatch({ type: 'NAVIGATE', screen }); });
    else act(() => dispatch({ type: 'NAVIGATE', screen }));
  }
  return <Modal title="FANMODUS DEMO CONTROLS" onClose={onClose} className="demo-sheet"><p>Explore the entire matchday in minutes. All location checks, timing and rewards are simulated.</p><label className="demo-select">Animation variant<select value={session.variant} onChange={e => { dispatch({ type: 'VARIANT', variant: e.target.value }); const url = new URL(window.location); url.searchParams.set('variant', e.target.value); window.history.replaceState(null, '', url); }}><option value="a">A — Minimal</option><option value="b">B — Balanced</option><option value="c">C — Expressive</option></select></label><div className="demo-grid"><button onClick={() => goToScreen(FLOW[Math.max(0, FLOW.indexOf(session.currentScreen) - 1)])}>Previous screen</button><button onClick={() => goToScreen(FLOW[FLOW.indexOf(session.currentScreen) + 1] || 'menu')}>Next screen</button><button onClick={() => jump('first')}>Skip to kick-off</button><button onClick={() => jump('halftime')}>Skip to half-time</button><button onClick={() => jump('second')}>Skip to second half</button><button onClick={() => jump('finished')}>Skip to full time</button><button onClick={() => act(() => dispatch({ type: 'DEMO_TIME' }))}>Set 86:32 / 86 entries</button><button onClick={() => openOverlay('lock')}>Lock screen mockup</button><button onClick={() => openOverlay('loading')}>Loading state</button><button onClick={() => openOverlay('connection')}>Connection lost</button><button onClick={() => openOverlay('activation-error')}>Activation failed</button><button onClick={() => { dispatch({ type: 'LOCATION', permission: 'denied' }); openOverlay('location-error'); }}>Location denied</button><button onClick={() => act(() => dispatch({ type: 'RESET' }))}>Reset flow</button><button onClick={() => act(() => { try { localStorage.removeItem(STORAGE_KEY); } catch {} dispatch({ type: 'RESET' }); })}>Reset local session</button></div><p className="fine-print">Panel visibility: ?demo=1 shows controls. ?demo=0 hides them. Variant B is the default.</p></Modal>;
}
