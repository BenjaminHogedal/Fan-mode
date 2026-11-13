export const STORAGE_KEY = 'bvb-fanmodus-session-v1';
export const FLOW = ['menu', 'intro', 'how', 'prizes', 'activation', 'activating', 'activated', 'kickoff', 'first', 'halftime', 'second', 'fulltime', 'collecting', 'summary', 'thanks', 'prize'];
export const PHASE_SECONDS = { 'pre-match': 2060, first: 2700, halftime: 900, second: 2700 };
export const initialSession = {
  version: 1, currentScreen: 'menu', locationPermission: 'unknown',
  fanModusStatus: 'inactive', matchPhase: 'pre-match', phoneFreeSeconds: 0,
  phaseStartedAt: null, phaseEndsAt: null, ticketRevealed: false,
  prizeResult: 'not-winner', demoMode: true, history: [],
};
export const formatTime = (seconds) => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, '0')}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, '0')}`;
export function elapsedSeconds(state, now) {
  const running = ['first', 'second'].includes(state.matchPhase) && state.phaseStartedAt != null;
  return Math.floor(state.phoneFreeSeconds + (running ? Math.max(0, Math.min(now, state.phaseEndsAt) - state.phaseStartedAt) / 1000 : 0));
}
export function navigate(state, screen) {
  if (!FLOW.includes(screen) || screen === state.currentScreen) return state;
  return { ...state, currentScreen: screen, history: [...state.history, state.currentScreen].slice(-30) };
}
export function settle(state, now) {
  let next = state;
  while (next.phaseEndsAt != null && now >= next.phaseEndsAt && next.matchPhase !== 'finished') {
    const boundary = next.phaseEndsAt;
    const total = elapsedSeconds(next, boundary);
    const phase = { 'pre-match': 'first', first: 'halftime', halftime: 'second', second: 'finished' }[next.matchPhase];
    next = { ...next, phoneFreeSeconds: total, matchPhase: phase, phaseStartedAt: boundary, phaseEndsAt: phase === 'finished' ? null : boundary + PHASE_SECONDS[phase] * 1000, fanModusStatus: phase === 'finished' ? 'completed' : 'active' };
    if (['kickoff', 'first', 'halftime', 'second'].includes(next.currentScreen)) next = { ...next, currentScreen: phase === 'finished' ? 'fulltime' : phase };
  }
  return next;
}
export function sessionReducer(state, action) {
  const now = action.now ?? Date.now();
  switch (action.type) {
    case 'RESTORE': return action.session;
    case 'NAVIGATE': return navigate(state, action.screen);
    case 'BACK': return state.history.length ? { ...state, currentScreen: state.history.at(-1), history: state.history.slice(0, -1) } : state;
    case 'LOCATION': return { ...state, locationPermission: action.permission };
    case 'ACTIVATE': return state.locationPermission === 'granted' ? navigate({ ...state, fanModusStatus: 'activating', ticketRevealed: false }, 'activating') : state;
    case 'ACTIVATED': return navigate({ ...state, fanModusStatus: 'active', matchPhase: 'pre-match', phaseStartedAt: now, phaseEndsAt: now + PHASE_SECONDS['pre-match'] * 1000, phoneFreeSeconds: 0 }, 'activated');
    case 'TICK': return settle(state, now);
    case 'REVEAL': return { ...state, ticketRevealed: true };
    case 'RESET': return { ...initialSession, demoMode: state.demoMode };
    case 'DEMO_JUMP': {
      const phase = action.phase;
      const defaults = { first: 0, halftime: 2700, second: 2700, finished: 5192 };
      return { ...state, currentScreen: phase === 'finished' ? 'fulltime' : phase, locationPermission: 'granted', fanModusStatus: phase === 'finished' ? 'completed' : 'active', matchPhase: phase, phoneFreeSeconds: action.seconds ?? defaults[phase], phaseStartedAt: now, phaseEndsAt: phase === 'finished' ? null : now + PHASE_SECONDS[phase] * 1000, ticketRevealed: false };
    }
    case 'DEMO_TIME': return navigate({ ...state, phoneFreeSeconds: 5192, phaseStartedAt: null, phaseEndsAt: null, matchPhase: 'finished', fanModusStatus: 'completed' }, 'summary');
    default: return state;
  }
}
export function restoreSession(raw, options, now) {
  try {
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !FLOW.includes(saved.currentScreen) || !Number.isFinite(saved.phoneFreeSeconds) || saved.phoneFreeSeconds < 0 || !['pre-match', 'first', 'halftime', 'second', 'finished'].includes(saved.matchPhase) || !Array.isArray(saved.history) || (saved.phaseEndsAt !== null && !Number.isFinite(saved.phaseEndsAt)) || (saved.phaseStartedAt !== null && !Number.isFinite(saved.phaseStartedAt))) throw new Error('Invalid session');
    const result = settle({ ...initialSession, ...saved, ...options, history: saved.history.filter(s => FLOW.includes(s)) }, now);
    delete result.variant; // Ignore animation choices stored by older prototype versions.
    if (result.currentScreen === 'activating') return { ...result, currentScreen: 'activation', fanModusStatus: 'inactive' };
    return result;
  } catch { return { ...initialSession, ...options }; }
}
