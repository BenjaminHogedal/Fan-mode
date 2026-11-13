import { swipeTiming } from './activation-design.js';

export function abortableDelay(milliseconds, signal) {
  return new Promise(resolve => {
    if (signal.aborted) { resolve(false); return; }
    const abort = () => { clearTimeout(timer); resolve(false); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(true); }, milliseconds);
    signal.addEventListener('abort', abort, { once: true });
  });
}

// Figma prototype dwell times start after each 300 ms smart-animation transition.
export async function playSwipeSequence({ signal, reducedMotion = false, onStage, onComplete, delay = abortableDelay }) {
  const transition = reducedMotion ? 0 : swipeTiming.transition;
  for (const [stage, dwell] of [['trigger', swipeTiming.trigger], ['loading', swipeTiming.loading], ['completed', swipeTiming.completed]]) {
    if (signal.aborted) return false;
    onStage(stage);
    const elapsed = await delay((transition + dwell) * 1000, signal);
    if (!elapsed || signal.aborted) return false;
  }
  return onComplete() !== false;
}
