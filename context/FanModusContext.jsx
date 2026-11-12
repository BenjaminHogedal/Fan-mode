'use client';
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { initialSession, sessionReducer, restoreSession, elapsedSeconds, STORAGE_KEY } from '@/lib/fanmodus';

const FanModusContext = createContext(null);
export function FanModusProvider({ children }) {
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    const restore = setTimeout(() => {
      const query = new URLSearchParams(window.location.search);
      const options = { demoMode: query.get('demo') === '1' || (process.env.NODE_ENV === 'development' && query.get('demo') !== '0'), variant: ['a', 'b', 'c'].includes(query.get('variant')) ? query.get('variant') : 'b' };
      let raw = null;
      try { raw = localStorage.getItem(STORAGE_KEY); } catch { setStorageWarning(true); }
      dispatch({ type: 'RESTORE', session: restoreSession(raw, options, Date.now()) });
      setNow(Date.now());
      setReady(true);
    }, 0);
    return () => clearTimeout(restore);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch { queueMicrotask(() => setStorageWarning(true)); }
  }, [session, ready]);
  useEffect(() => {
    if (!ready) return;
    const tick = () => { const time = Date.now(); setNow(time); dispatch({ type: 'TICK', now: time }); };
    const interval = setInterval(tick, 500);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', tick); };
  }, [ready]);
  const seconds = elapsedSeconds(session, now);
  return <FanModusContext.Provider value={{ session, dispatch, ready, now, seconds, entries: Math.floor(seconds / 60), storageWarning }}>{children}</FanModusContext.Provider>;
}
export const useFanModus = () => useContext(FanModusContext);
