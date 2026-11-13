'use client';
import Modal from '@/components/ui/Modal';
import { useFanModus } from '@/context/FanModusContext';
import { FLOW } from '@/lib/fanmodus';

export default function DemoControls({ onClose }) {
  const { session, dispatch } = useFanModus();
  const index = FLOW.indexOf(session.currentScreen);

  function goToScreen(screen) {
    if (['first', 'halftime', 'second', 'fulltime'].includes(screen)) {
      dispatch({ type: 'DEMO_JUMP', phase: screen === 'fulltime' ? 'finished' : screen });
    } else if (['activating', 'activated', 'kickoff'].includes(screen)) {
      dispatch({ type: 'LOCATION', permission: 'granted' });
      dispatch({ type: 'ACTIVATED' });
      dispatch({ type: 'NAVIGATE', screen });
    } else {
      dispatch({ type: 'NAVIGATE', screen });
    }
    onClose();
  }

  return <Modal title="DEMO" onClose={onClose} className="demo-sheet"><div className="demo-grid">
    <button disabled={index <= 0} onClick={() => goToScreen(FLOW[index - 1])}>Previous screen</button>
    <button onClick={() => goToScreen(FLOW[index + 1] || 'menu')}>Next screen</button>
    <button onClick={() => { dispatch({ type: 'RESET' }); onClose(); }}>Reset flow</button>
  </div></Modal>;
}
