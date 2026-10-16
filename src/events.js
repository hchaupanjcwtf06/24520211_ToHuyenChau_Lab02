
/**
 * Lab 02 - Exercise 2
 * Root Event Delegation Hub
 */

const eventHandlers = new WeakMap();

const supportedEvents = [
  'click',
  'input',
  'change',
  'keydown'
];

/**
 * Register handlers for a DOM element.
 *
 * Does not attach individual DOM listeners.
 */
export function registerEventHandlers(dom, props) {
  const handlers = {};

  for (const [name, value] of Object.entries(props)) {
    if (
      /^on[A-Z]/.test(name) &&
      typeof value === 'function'
    ) {
      const eventName = name.slice(2).toLowerCase();

      if (supportedEvents.includes(eventName)) {
        handlers[eventName] = value;
      }
    }
  }

  eventHandlers.set(dom, handlers);
}

/**
 * Attach one listener per event type to the root.
 */
export function setupEventDelegation(root) {
  if (!(root instanceof Element)) {
    throw new TypeError(
      'Event delegation root must be an Element'
    );
  }

  const listeners = new Map();

  for (const eventType of supportedEvents) {
    const listener = event => {
      let target = event.target;

      // Walk from target toward the root.
      while (target && target !== root) {
        const handlers = eventHandlers.get(target);

        const handler = handlers?.[eventType];

        if (typeof handler === 'function') {
          handler(event);
        }

        if (event.cancelBubble) {
          break;
        }

        target = target.parentNode;
      }
    };

    root.addEventListener(eventType, listener);
    listeners.set(eventType, listener);
  }

  /**
   * Cleanup function for unmounting.
   */
  return function cleanup() {
    for (const [eventType, listener] of listeners) {
      root.removeEventListener(eventType, listener);
    }

    listeners.clear();
  };
}
