
/**
 * Lab 02 - Exercise 2
 * State Store and Cursor Engine
 */

const stateStore = [];

let cursor = 0;

let triggerRender = () => {};

/**
 * Reset hook position before every render.
 */
export function resetCursor() {
  cursor = 0;
}

/**
 * Return the current cursor for verification.
 */
export function getCursor() {
  return cursor;
}

/**
 * Register the application's render function.
 */
export function setRenderer(renderFunction) {
  if (typeof renderFunction !== 'function') {
    throw new TypeError(
      'Renderer must be a function'
    );
  }

  triggerRender = renderFunction;
}

/**
 * Reserve one hook position.
 */
export function reserveStateSlot() {
  const slot = cursor;
  cursor += 1;
  return slot;
}

/**
 * Read a state slot.
 */
export function readState(slot) {
  return stateStore[slot];
}

/**
 * Check whether a slot has been initialized.
 */
export function hasState(slot) {
  return Object.prototype.hasOwnProperty.call(
    stateStore,
    slot
  );
}

/**
 * Write a state value.
 */
export function writeState(slot, value) {
  stateStore[slot] = value;
}

/**
 * Request a new render.
 */
export function requestRender() {
  triggerRender();
}
