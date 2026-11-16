import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playTicketFlip, WIN_TICKET_TIMING } from '../lib/ticket-flip.js';

function sequence(options = {}) {
  const events = [];
  const controller = new AbortController();
  const args = {
    signal: controller.signal,
    anticipate: async () => { events.push('lift'); },
    turn: async () => { events.push('turn'); },
    sound: () => events.push('sound'),
    reveal: () => events.push('reveal'),
    impact: () => events.push('impact'),
    land: async () => { events.push('land'); },
    delay: async ms => { events.push(ms); return true; },
    ...options,
  };
  return { events, controller, args };
}

test('ticket sound starts with the turn and the prize appears at its midpoint', async () => {
  const f = sequence();
  assert.equal(await playTicketFlip(f.args), true);
  assert.deepEqual(f.events, ['lift', 'sound', 'turn', 310, 'reveal', 'impact', 'land']);
});

test('reduced motion reveals immediately with one sound and no 3D or light effects', async () => {
  const f = sequence({ reduced: true });
  assert.equal(await playTicketFlip(f.args), true);
  assert.deepEqual(f.events, ['sound', 'reveal']);
});

test('navigation during anticipation prevents sound and reveal', async () => {
  const f = sequence();
  f.args.anticipate = async () => f.controller.abort();
  assert.equal(await playTicketFlip(f.args), false);
  assert.deepEqual(f.events, []);
});

test('navigation during the turn prevents reveal and landing', async () => {
  const f = sequence();
  f.args.delay = async () => { f.controller.abort(); return false; };
  assert.equal(await playTicketFlip(f.args), false);
  assert.deepEqual(f.events, ['lift', 'sound', 'turn']);
});


test('winning reveal uses its own suspense timing and keeps one reveal and sound', async () => {
  const f = sequence({ timing: WIN_TICKET_TIMING });
  assert.equal(await playTicketFlip(f.args), true);
  assert.deepEqual(f.events, ['lift', 'sound', 'turn', 430, 'reveal', 'impact', 'land']);
});
