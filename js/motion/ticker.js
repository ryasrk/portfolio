/**
 * One rAF loop for the whole page.
 *
 * Reference-counted: subscribers register (callback, getFramerate); each frame
 * the loop walks a snapshot of the set and calls a subscriber only when
 * `time - last > getFramerate()`. A framerate of 0 runs every tick; 1000/60 - 2
 * gives 60 on a 60Hz screen and every second tick at 120.
 *
 * The loop starts on the first subscriber and cancels on the last.
 */

const subscribers = new Map();
let handle = null;

const frame = (time) => {
  handle = requestAnimationFrame(frame);
  // Snapshot: a callback may subscribe or unsubscribe during its own tick.
  for (const [callback, state] of [...subscribers]) {
    const budget = state.getFramerate();
    if (time - state.last <= budget) continue;
    state.last = time;
    callback(time);
  }
};

export const subscribe = (callback, getFramerate = () => 0) => {
  subscribers.set(callback, { last: 0, getFramerate });
  if (handle === null) handle = requestAnimationFrame(frame);
  return () => unsubscribe(callback);
};

export const unsubscribe = (callback) => {
  subscribers.delete(callback);
  if (subscribers.size === 0 && handle !== null) {
    cancelAnimationFrame(handle);
    handle = null;
  }
};

/** Framerate budget that lets a 60Hz screen through every tick. */
export const CAP_60 = 1000 / 60 - 2;
