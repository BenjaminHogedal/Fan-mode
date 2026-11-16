import { abortableDelay } from './swipe-sequence.js';

export const WIN_TICKET_TIMING = { anticipation: 0.32, turn: 0.86, landing: 0.38 };
export const TICKET_TIMING = { anticipation: 0.24, turn: 0.62, landing: 0.34 };

// Keep the reveal and sound on the same timeline, including cancellation on navigation.
export async function playTicketFlip({ signal, reduced = false, anticipate, turn, land, sound, reveal, impact, timing = TICKET_TIMING, delay = abortableDelay }) {
  if (signal.aborted) return false;
  if (reduced) {
    sound();
    reveal();
    return true;
  }
  await anticipate();
  if (signal.aborted) return false;
  sound();
  const turning = turn();
  if (!await delay(timing.turn * 500, signal) || signal.aborted) return false;
  reveal();
  impact();
  await turning;
  if (signal.aborted) return false;
  await land();
  return !signal.aborted;
}
