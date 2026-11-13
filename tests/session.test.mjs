import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialSession, sessionReducer, elapsedSeconds, settle, restoreSession, formatTime } from '../lib/fanmodus.js';
const start = 1000000;
const reduce = (state, type, payload = {}) => sessionReducer(state, { type, now: start, ...payload });
const kickoff = () => reduce(initialSession, 'DEMO_JUMP', { phase: 'first' });
test('activation requires simulated location permission', () => {
  assert.equal(reduce(initialSession, 'ACTIVATE').currentScreen, 'menu');
  const allowed = reduce(initialSession, 'LOCATION', { permission: 'granted' });
  assert.equal(reduce(allowed, 'ACTIVATE').currentScreen, 'activating');
});
test('timer derives elapsed time from timestamps, including a sleeping tab', () => {
  assert.equal(elapsedSeconds(kickoff(), start + 1375000), 1375);
  assert.equal(Math.floor(elapsedSeconds(kickoff(), start + 1375000) / 60), 22);
});
test('half-time preserves entries and excludes all break time', () => {
  const half = settle(kickoff(), start + 2700000);
  assert.equal(half.matchPhase, 'halftime');
  assert.equal(half.currentScreen, 'halftime');
  assert.equal(elapsedSeconds(half, start + 3100000), 2700);
  const second = settle(half, start + 3600000);
  assert.equal(second.matchPhase, 'second');
  assert.equal(elapsedSeconds(second, start + 3660000), 2760);
});
test('one background catch-up handles the entire match and caps scoring at full time', () => {
  const finished = settle(kickoff(), start + 10000000);
  assert.equal(finished.matchPhase, 'finished');
  assert.equal(finished.currentScreen, 'fulltime');
  assert.equal(elapsedSeconds(finished, start + 99999999), 5400);
});
test('reload recovers running session and ignores broken local data', () => {
  const recovered = restoreSession(JSON.stringify({ ...kickoff(), variant: 'c' }), { demoMode: false }, start + 3660000);
  assert.equal(recovered.matchPhase, 'second');
  assert.equal(elapsedSeconds(recovered, start + 3660000), 2760);
  assert.equal(recovered.demoMode, false);
  assert.equal('variant' in recovered, false);
  assert.equal(restoreSession('{bad', {}, start).currentScreen, 'menu');
  assert.equal(restoreSession(JSON.stringify({ version: 1 }), {}, start).currentScreen, 'menu');
});
test('direct full-time demo produces exactly 86 entries from 86:32', () => {
  const demo = reduce(initialSession, 'DEMO_JUMP', { phase: 'finished' });
  assert.equal(formatTime(elapsedSeconds(demo, start)), '86:32');
  assert.equal(Math.floor(elapsedSeconds(demo, start) / 60), 86);
  assert.equal(elapsedSeconds(demo, start + 900000), 5192);
});
test('reveal is idempotent and reset clears session and ticket', () => {
  const revealed = reduce(initialSession, 'REVEAL');
  assert.deepEqual(reduce(revealed, 'REVEAL'), revealed);
  assert.equal(reduce(revealed, 'RESET').ticketRevealed, false);
});
test('86:32 preset freezes a consistent result even when called during a live half', () => {
  const preset = reduce(kickoff(), 'DEMO_TIME');
  assert.equal(preset.currentScreen, 'summary');
  assert.equal(preset.matchPhase, 'finished');
  assert.equal(elapsedSeconds(preset, start + 9999999), 5192);
});

test('screen taps advance match phases and restart the next phase clock at the current time', () => {
  const activated = reduce({ ...initialSession, locationPermission: 'granted' }, 'ACTIVATED');
  const countdown = reduce(activated, 'NAVIGATE', { screen: 'kickoff' });
  const first = reduce(countdown, 'ADVANCE_MATCH');
  assert.equal(first.currentScreen, 'first');
  assert.equal(first.matchPhase, 'first');
  assert.equal(first.phaseEndsAt, start + 2700000);
  assert.equal(first.phoneFreeSeconds, 0);
  const half = reduce(first, 'ADVANCE_MATCH');
  assert.equal(half.currentScreen, 'halftime');
  assert.equal(half.phaseEndsAt, start + 900000);
  assert.equal(half.phoneFreeSeconds, 2700);
  const second = settle(half, half.phaseEndsAt);
  const finished = reduce(second, 'ADVANCE_MATCH');
  assert.equal(finished.currentScreen, 'fulltime');
  assert.equal(finished.matchPhase, 'finished');
  assert.equal(finished.phoneFreeSeconds, 5400);
  assert.equal(finished.phaseEndsAt, null);
  assert.equal(reduce(finished, 'ADVANCE_MATCH'), finished);
});
