export const SOUND_FILES = { activated: '/sounds/activated.mp3', ticket: '/sounds/ticket-flip.mp3' };

// Allow a brief audio-device startup, but never replay a stale animation cue.
const MAX_CUE_DELAY = 200;
export function createSoundController(env = globalThis) {
  let context;
  let loading;
  const buffers = new Map();
  const playing = new Map();
  const pending = new Map();
  function stop() {
    pending.clear();
    playing.forEach(source => { try { source.stop(); } catch {} });
    playing.clear();
  }
  function prepare() {
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
    void prepare();
    try {
      // Invoke resume immediately inside the gesture; await its result in play().
      return Promise.resolve(context?.resume()).then(() => context?.state === 'running', () => false);
    } catch { return Promise.resolve(false); }
  }
  return {
    prepare,
    unlock,
    stop,
    async play(name, { restart = false } = {}) {
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
        if (!ready || pending.get(name) !== request || !buffers.has(name)) return false;
        if (playing.has(name)) {
          try { playing.get(name).stop(); } catch {}
          playing.delete(name);
        }
        const source = context.createBufferSource();
        source.buffer = buffers.get(name);
        source.connect(context.destination);
        playing.set(name, source);
        source.onended = () => { if (playing.get(name) === source) playing.delete(name); source.disconnect(); };
        source.start();
        return true;
      } catch { return false; }
      finally {
        clearTimeout(timer);
        if (pending.get(name) === request) pending.delete(name);
      }
    },
  };
}
