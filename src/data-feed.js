
/**
 * Lab 02 - Exercise 3
 * Simulated asynchronous data service.
 */

const sampleItems = Object.freeze([
    {
      id: 1,
      title: 'Virtual DOM Architecture',
      category: 'Core',
      description: 'Build UI with immutable VNodes.'
    },
    {
      id: 2,
      title: 'Reactive State Engine',
      category: 'State',
      description: 'Store state using hook slots.'
    },
    {
      id: 3,
      title: 'Root Event Delegation',
      category: 'Events',
      description: 'Handle events through a root listener.'
    },
    {
      id: 4,
      title: 'Resilient Data Loading',
      category: 'Async',
      description: 'Handle loading, success and error states.'
    }
  ]);
  
  /**
   * mode:
   * - success: resolve with sample data
   * - error: reject with a simulated error
   *
   * signal:
   * - cancel an outdated request
   */
  export function fetchFeed({
    mode = 'success',
    signal
  } = {}) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(
          new DOMException(
            'Request aborted',
            'AbortError'
          )
        );
        return;
      }
  
      let timer;
  
      const onAbort = () => {
        clearTimeout(timer);
  
        reject(
          new DOMException(
            'Request aborted',
            'AbortError'
          )
        );
      };
  
      signal?.addEventListener(
        'abort',
        onAbort,
        { once: true }
      );
  
      timer = setTimeout(() => {
        signal?.removeEventListener(
          'abort',
          onAbort
        );
  
        if (mode === 'error') {
          reject(
            new Error(
              'Unable to connect to the data service.'
            )
          );
          return;
        }
  
        if (mode !== 'success') {
          reject(
            new Error('Unsupported request mode')
          );
          return;
        }
  
        resolve(
          sampleItems.map(item => ({ ...item }))
        );
      }, 1800);
    });
  }
  