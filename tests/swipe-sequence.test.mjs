import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playSwipeSequence, abortableDelay } from '../lib/swipe-sequence.js';

test('a completed swipe visits trigger, loading and completed before activating exactly once', async () => {
  const events = [];
  const controller = new AbortController();
  const result = await playSwipeSequence({
    signal: controller.signal,
    onStage: stage => events.push(stage),
    delay: async ms => { events.push(ms); return true; },
    onComplete: () => events.push('activate'),
  });
  assert.equal(result, true);
  assert.deepEqual(events, ['trigger', 500, 'loading', 800, 'completed', 1300, 'activate']);
});
test('leaving the screen during loading cancels completion and navigation', async () => {
  const events = [];
  const controller = new AbortController();
  const result = await playSwipeSequence({
    signal: controller.signal,
    onStage: stage => { events.push(stage); if (stage === 'loading') controller.abort(); },
    delay: async () => true,
    onComplete: () => assert.fail('Cancelled swipe must not activate'),
  });
  assert.equal(result, false);
  assert.deepEqual(events, ['trigger', 'loading']);
});
test('reduced motion removes transition movement time and preserves the status sequence', async () => {
  const times = [];
  const result = await playSwipeSequence({
    signal: new AbortController().signal, reducedMotion: true,
    onStage: () => {}, delay: async ms => { times.push(ms); return true; }, onComplete: () => true,
  });
  assert.equal(result, true);
  assert.deepEqual(times, [200, 500, 1000]);
});
test('validation failure at completion is returned so the control can retry', async () => {
  assert.equal(await playSwipeSequence({signal: new AbortController().signal, onStage: () => {}, delay: async () => true, onComplete: () => false}), false);
});
test('a pending status delay is cleared immediately when unmounted', async () => {
  const controller = new AbortController();
  const pending = abortableDelay(60000, controller.signal);
  controller.abort();
  assert.equal(await pending, false);
});
