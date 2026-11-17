import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSoundController, SOUND_FILES, SOUND_PREFERENCE_KEY } from '../lib/sounds.js';

function fixture({ blocked = false, resumeDelay = 0, loadDelay = 0, storedMute, storageBlocked = false } = {}) {
  const started = [], stopped = [], fetched = [], sources = [], fades = [];
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  class AudioContext {
    state = 'suspended';
    currentTime = 10;
    destination = {};
    createGain() {
      return { connect() {}, disconnect() {}, gain: {
        setValueAtTime(value, time) { fades.push(['set', value, time]); },
        linearRampToValueAtTime(value, time) { fades.push(['ramp', value, time]); },
      } };
    }
    async resume() {
      if (blocked) throw new Error('NotAllowedError');
      if (resumeDelay) await delay(resumeDelay);
      this.state = 'running';
    }
    async decodeAudioData(data) { return data; }
    createBufferSource() {
      const source = { connect() {}, disconnect() {}, start(...args) { this.startArguments = args; started.push(this.buffer); }, stop() { stopped.push(this.buffer); } };
      sources.push(source);
      return source;
    }
  }
  const storage = new Map(storedMute === undefined ? [] : [[SOUND_PREFERENCE_KEY, storedMute]]);
  const env = { AudioContext,
    localStorage: {
      getItem(key) { if (storageBlocked) throw Error('Storage unavailable'); return storage.get(key) ?? null; },
      setItem(key, value) { if (storageBlocked) throw Error('Storage unavailable'); storage.set(key, value); },
    },
    fetch: async url => {
      fetched.push(url);
      if (loadDelay) await delay(loadDelay);
      return { ok: true, arrayBuffer: async () => url };
    },
  };
  const sound = createSoundController(env);
  return { sound, started, stopped, fetched, sources, fades, storage, env };
}

test('both MP3 cues are enabled by default and play once without overlap', async () => {
  const f = fixture(); await f.sound.prepare();
  assert.deepEqual(f.fetched.sort(), Object.values(SOUND_FILES).sort());
  for (const name of ['activated', 'ticket']) {
    assert.equal(await f.sound.play(name), true);
    assert.equal(await f.sound.play(name), false);
  }
  assert.deepEqual(f.started, [SOUND_FILES.activated, SOUND_FILES.ticket]);
  f.sound.stop(); assert.equal(f.stopped.length, 2);
});

test('both cues wait for asynchronous browser audio unlock instead of being discarded', async () => {
  const f = fixture({ resumeDelay: 20 }); await f.sound.prepare();
  for (const name of ['activated', 'ticket']) assert.equal(await f.sound.play(name), true);
  assert.deepEqual(f.started, [SOUND_FILES.activated, SOUND_FILES.ticket]);
});

test('a cue can finish loading during audio startup', async () => {
  const f = fixture({ loadDelay: 20 });
  assert.equal(await f.sound.play('ticket'), true);
});

test('duplicate pending cues play only once', async () => {
  const f = fixture({ resumeDelay: 20 });
  assert.deepEqual(await Promise.all([f.sound.play('activated'), f.sound.play('activated')]), [true, false]);
  assert.equal(f.started.length, 1);
});

test('stopping during startup cancels the pending cue', async () => {
  const f = fixture({ resumeDelay: 20 });
  const pending = f.sound.play('activated'); f.sound.stop();
  assert.equal(await pending, false);
  assert.equal(f.started.length, 0);
});

test('a stale cue is discarded if device startup takes too long', async () => {
  const f = fixture({ resumeDelay: 240 });
  assert.equal(await f.sound.play('activated'), false);
  await new Promise(resolve => setTimeout(resolve, 60));
  assert.equal(f.started.length, 0);
});

test('autoplay rejection and unsupported browsers do not interrupt the app', async () => {
  const f = fixture({ blocked: true });
  assert.equal(await f.sound.play('activated'), false);
  assert.equal(await createSoundController({}).play('ticket'), false);
});

test('every ticket flip in either direction restarts the cue without overlap', async () => {
  const f = fixture();
  for (let flip = 0; flip < 4; flip++) assert.equal(await f.sound.play('ticket', { restart: true }), true);
  assert.equal(f.started.length, 4); assert.equal(f.stopped.length, 3);
  f.sources[0].onended();
  assert.equal(await f.sound.play('ticket'), false);
});

test('the crowd cue plays seconds two through five with a smooth entrance and exit', async () => {
  const f = fixture();
  assert.equal(await f.sound.play('crowd'), true);
  assert.deepEqual(f.started, [SOUND_FILES.crowd]);
  assert.deepEqual(f.sources[0].startArguments, [0, 2, 3]);
  assert.deepEqual(f.fades, [['set', 0, 10], ['ramp', 1, 10.12], ['set', 1, 12.75], ['ramp', 0, 13]]);
  assert.equal(await f.sound.play('crowd'), false);
});

test('ticket reveal audio is limited to the flip sequence with a soft ending', async () => {
  const f = fixture();
  assert.equal(await f.sound.play('ticket', { restart: true, duration: 0.95 }), true);
  assert.deepEqual(f.sources[0].startArguments, [0, 0, 0.95]);
  assert.deepEqual(f.fades.map(([kind, value, time]) => [kind, value, Number(time.toFixed(3))]), [['set', 0, 10], ['ramp', 1, 10.015], ['set', 1, 10.8], ['ramp', 0, 10.95]]);
});

test('a saved mute is restored before any cue can start', async () => {
  const f = fixture({ storedMute: 'true' });
  assert.equal(await f.sound.play('activated'), false);
  assert.equal(f.sound.getMuted(), true);
  assert.equal(f.started.length, 0);
});

test('toggle persists both choices and restores them in a new controller', async () => {
  const f = fixture();
  f.sound.toggleMute();
  assert.equal(f.sound.getMuted(), true);
  assert.equal(f.storage.get(SOUND_PREFERENCE_KEY), 'true');
  const refreshed = createSoundController(f.env);
  refreshed.restorePreference();
  assert.equal(refreshed.getMuted(), true);
  refreshed.toggleMute();
  assert.equal(refreshed.getMuted(), false);
  assert.equal(f.storage.get(SOUND_PREFERENCE_KEY), 'false');
  const refreshedAgain = createSoundController(f.env);
  refreshedAgain.restorePreference();
  assert.equal(refreshedAgain.getMuted(), false);
});

test('mute stops all three currently playing sounds immediately', async () => {
  const f = fixture();
  for (const name of Object.keys(SOUND_FILES)) assert.equal(await f.sound.play(name), true);
  f.sound.setMuted(true);
  assert.equal(f.stopped.length, 3);
  assert.deepEqual(f.stopped.sort(), Object.values(SOUND_FILES).sort());
});

test('all cues stay silent while muted and unmute does not replay them', async () => {
  const f = fixture(); await f.sound.prepare();
  f.sound.setMuted(true);
  for (const name of Object.keys(SOUND_FILES)) assert.equal(await f.sound.play(name), false);
  f.sound.setMuted(false);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.started.length, 0);
  assert.equal(await f.sound.play('ticket'), true);
  assert.equal(f.started.length, 1);
});

test('muting then quickly unmuting cancels a pending cue permanently', async () => {
  const f = fixture({ resumeDelay: 20 });
  const pending = f.sound.play('activated');
  f.sound.setMuted(true);
  f.sound.setMuted(false);
  assert.equal(await pending, false);
  assert.equal(f.started.length, 0);
  assert.equal(await f.sound.play('activated'), true);
});

test('mute remains usable if localStorage reads and writes are blocked', async () => {
  const f = fixture({ storageBlocked: true });
  await f.sound.prepare();
  assert.equal(f.sound.getMuted(), false);
  f.sound.toggleMute();
  assert.equal(await f.sound.play('ticket'), false);
  f.sound.toggleMute();
  assert.equal(await f.sound.play('ticket'), true);
});

test('the button subscription follows restoration and toggles and can unsubscribe', () => {
  const f = fixture({ storedMute: 'true' });
  const snapshots = [];
  const unsubscribe = f.sound.subscribe(() => snapshots.push(f.sound.getMuted()));
  f.sound.restorePreference();
  f.sound.setMuted(false);
  f.sound.setMuted(true);
  unsubscribe();
  f.sound.setMuted(false);
  assert.deepEqual(snapshots, [true, false, true]);
});
