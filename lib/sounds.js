export const SOUND_FILES = { activated: '/sounds/activated.mp3', ticket: '/sounds/ticket-flip.mp3', crowd: '/sounds/crowd-roar.mp3' };
export const SOUND_PREFERENCE_KEY = 'bvb-fanmodus-sound-muted-v1';

// Allow a brief audio-device startup, but never replay a stale animation cue.
const MAX_CUE_DELAY = 200;
export function createSoundController(env = globalThis) {
  let context;
  let loading;
  let muted = false;
  let preferenceLoaded = false;
  const listeners = new Set();
  const buffers = new Map();
  const playing = new Map();
  const pending = new Map();
  function stop() {
    pending.clear();
    playing.forEach(source => { try { source.stop(); } catch {} });
    playing.clear();
  }
  function restorePreference() {
    if (preferenceLoaded) return;
    preferenceLoaded = true;
    try {
      muted = env.localStorage.getItem(SOUND_PREFERENCE_KEY) === 'true';
    } catch { /* Sound remains usable when storage is unavailable. */ }
    if (muted) {
      stop();
      listeners.forEach(listener => listener());
    }
  }
  function setMuted(value) {
    restorePreference();
    muted = Boolean(value);
    if (muted) stop();
    try { env.localStorage.setItem(SOUND_PREFERENCE_KEY, String(muted)); } catch {}
    listeners.forEach(listener => listener());
    // Unlock during this gesture without replaying any previous cue.
    if (!muted) void unlock();
  }
  function prepare() {
    restorePreference();
    if (loading) return loading;
    const AudioContext = env.AudioContext || env.webkitAudioContext;
    if (!AudioContext) return Promise.resolve();
    try {
      context = new AudioContext();
      loading = Promise.all(Object.entries(SOUND_FILES).map(async ([name, url]) => {
        try {
          const response = await env.fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          buffers.set(name, await context.decodeAudioData(await response.arrayBuffer()));
        } catch (error) { env.console?.warn(`FanModus: could not load ${url}`, error); }
      }));
    } catch { return Promise.resolve(); }
    return loading;
  }
  function unlock() {
    restorePreference();
    if (muted) return Promise.resolve(false);
    void prepare();
    try {
      // Invoke resume immediately inside the gesture; await its result in play().
      return Promise.resolve(context?.resume()).then(() => context?.state === 'running', () => false);
    } catch { return Promise.resolve(false); }
  }
  return {
    getMuted: () => muted,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    restorePreference,
    setMuted,
    toggleMute() { restorePreference(); setMuted(!muted); },
    prepare,
    unlock,
    stop,
    async play(name, { restart = false, duration } = {}) {
      restorePreference();
      if (muted) return false;
      if (!(name in SOUND_FILES)) return false;
      if (!restart && (playing.has(name) || pending.has(name))) return false;
      const request = {};
      pending.set(name, request);
      let timer;
      try {
        const ready = await Promise.race([
          Promise.all([prepare(), unlock()]).then(([, unlocked]) => unlocked),
          new Promise(resolve => { timer = setTimeout(() => resolve(false), MAX_CUE_DELAY); }),
        ]);
        if (muted || !ready || pending.get(name) !== request || !buffers.has(name)) return false;
        if (playing.has(name)) {
          try { playing.get(name).stop(); } catch {}
          playing.delete(name);
        }
        const source = context.createBufferSource();
        source.buffer = buffers.get(name);
        const clipDuration = name === 'crowd' ? 3 : duration;
        let gain;
        if (clipDuration !== undefined) {
          gain = context.createGain();
          const start = context.currentTime;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(1, start + (name === 'crowd' ? 0.12 : 0.015));
          gain.gain.setValueAtTime(1, start + clipDuration - (name === 'crowd' ? 0.25 : 0.15));
          gain.gain.linearRampToValueAtTime(0, start + clipDuration);
          source.connect(gain);
          gain.connect(context.destination);
        } else {
          source.connect(context.destination);
        }
        playing.set(name, source);
        source.onended = () => { if (playing.get(name) === source) playing.delete(name); source.disconnect(); gain?.disconnect(); };
        if (clipDuration !== undefined) source.start(0, name === 'crowd' ? 2 : 0, clipDuration);
        else source.start();
        return true;
      } catch { return false; }
      finally {
        clearTimeout(timer);
        if (pending.get(name) === request) pending.delete(name);
      }
    },
  };
}
