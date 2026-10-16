
/**
 * Lab 02 - Exercise 3
 * Resilient State Machine & Skeleton Loader
 */

import {
    createElement as h,
    renderToDOM
  } from './mini-react.js';
  
  import {
    useState,
    resetCursor,
    setRenderer
  } from './state.js';
  
  import {
    setupEventDelegation
  } from './events.js';
  
  import {
    STATUS,
    idleState,
    loadingState,
    successState,
    errorState,
    transition
  } from './async-machine.js';
  
  import { fetchFeed } from './data-feed.js';
  
  import './exercise3.css';
  
  const root = document.getElementById('app');
  
  if (!root) {
    throw new Error('Root #app was not found');
  }
  
  // Store request lifecycle outside render.
  let activeController = null;
  let requestId = 0;
  
  /**
   * The application component.
   */
  function DataFeed() {
    const [state, setState] = useState(idleState);
  
    const [mode, setMode] = useState('success');
  
    /**
     * Start a new async request.
     */
    async function loadData() {
      // Cancel the previous request.
      activeController?.abort();
  
      const controller = new AbortController();
  
      activeController = controller;
  
      const currentRequestId = ++requestId;
  
      setState(previous =>
        transition(previous, loadingState())
      );
  
      try {
        const items = await fetchFeed({
          mode,
          signal: controller.signal
        });
  
        // Ignore stale responses.
        if (currentRequestId !== requestId) {
          return;
        }
  
        setState(previous =>
          transition(previous, successState(items))
        );
      } catch (error) {
        if (currentRequestId !== requestId) {
          return;
        }
  
        if (error.name === 'AbortError') {
          return;
        }
  
        setState(previous =>
          transition(
            previous,
            errorState(error.message)
          )
        );
      }
    }
  
    /**
     * Render the current lifecycle state.
     */
    function renderContent() {
      switch (state.status) {
        case STATUS.IDLE:
          return h(
            'section',
            {
              className: 'feed-panel',
              'aria-label': 'Idle state'
            },
  
            h('h2', null, 'Ready to load'),
  
            h(
              'p',
              null,
              'No request has started yet.'
            ),
  
            h(
              'button',
              {
                type: 'button',
                className: 'primary-button',
                onClick: loadData
              },
              'Load Data'
            )
          );
  
        case STATUS.LOADING:
          return h(
            'section',
            {
              className: 'feed-panel',
              'aria-label': 'Loading state',
              'aria-busy': 'true'
            },
  
            h('h2', null, 'Loading data...'),
  
            h(
              'p',
              {
                role: 'status',
                'aria-live': 'polite'
              },
              'Please wait while data is loading.'
            ),
  
            h(
              'div',
              {
                className: 'skeleton-list',
                'aria-hidden': 'true'
              },
  
              ...[1, 2, 3].map(() =>
                h(
                  'div',
                  {
                    className: 'skeleton-card'
                  },
  
                  h(
                    'div',
                    {
                      className:
                        'skeleton-line skeleton-title'
                    }
                  ),
  
                  h(
                    'div',
                    {
                      className:
                        'skeleton-line skeleton-body'
                    }
                  ),
  
                  h(
                    'div',
                    {
                      className:
                        'skeleton-line skeleton-short'
                    }
                  )
                )
              )
            )
          );
  
        case STATUS.SUCCESS:
          return h(
            'section',
            {
              className: 'feed-panel',
              'aria-label': 'Success state'
            },
  
            h('h2', null, 'Data loaded successfully'),
  
            h(
              'p',
              {
                role: 'status',
                'aria-live': 'polite'
              },
              `${state.data.length} items received.`
            ),
  
            h(
              'ul',
              {
                className: 'feed-grid'
              },
  
              ...state.data.map(item =>
                h(
                  'li',
                  {
                    className: 'feed-card',
                    key: item.id
                  },
  
                  h(
                    'span',
                    {
                      className: 'category-badge'
                    },
                    item.category
                  ),
  
                  h('h3', null, item.title),
  
                  h(
                    'p',
                    null,
                    item.description
                  )
                )
              )
            ),
  
            h(
              'button',
              {
                type: 'button',
                className: 'primary-button',
                onClick: loadData
              },
              'Reload Data'
            )
          );
  
        case STATUS.ERROR:
          return h(
            'section',
            {
              className: 'feed-panel error-panel',
              'aria-label': 'Error state'
            },
  
            h(
              'h2',
              null,
              'Connection Error'
            ),
  
            h(
              'p',
              {
                role: 'alert'
              },
              state.error
            ),
  
            h(
              'button',
              {
                type: 'button',
                className: 'retry-button',
                onClick: loadData
              },
              'Retry Connection'
            )
          );
  
        default:
          throw new Error(
            `Unknown state: ${state.status}`
          );
      }
    }
  
    return h(
      'main',
      {
        className: 'async-app'
      },
  
      h(
        'header',
        {
          className: 'async-header'
        },
  
        h(
          'h1',
          null,
          'Resilient Data Feed'
        ),
  
        h(
          'p',
          null,
          'Lab 02 - Exercise 3'
        ),
  
        h(
          'p',
          {
            className: 'state-indicator',
            'data-status': state.status
          },
          `Current State: ${state.status}`
        )
      ),
  
      h(
        'section',
        {
          className: 'mode-panel',
          'aria-label': 'Test controls'
        },
  
        h(
          'h2',
          null,
          'Simulation Mode'
        ),
  
        h(
          'p',
          null,
          'Choose a response mode to test the state machine.'
        ),
  
        h(
          'div',
          {
            className: 'mode-buttons'
          },
  
          h(
            'button',
            {
              type: 'button',
              'aria-pressed':
                mode === 'success' ? 'true' : 'false',
              onClick: () => setMode('success')
            },
            'Simulate Success'
          ),
  
          h(
            'button',
            {
              type: 'button',
              'aria-pressed':
                mode === 'error' ? 'true' : 'false',
              onClick: () => setMode('error')
            },
            'Simulate Error'
          )
        )
      ),
  
      renderContent()
    );
  }
  
  /**
   * Root render cycle.
   */
  let renderCount = 0;
  
  function renderApp() {
    resetCursor();
  
    const vnode = DataFeed();
  
    root.replaceChildren(
      renderToDOM(
        vnode,
        { delegateEvents: true }
      )
    );
  
    renderCount++;
  
    console.log(
      `Exercise 3 render: ${renderCount}`
    );
  }
  
  /**
   * Initialize root delegation once.
   */
  const cleanupEvents = setupEventDelegation(root);
  
  setRenderer(renderApp);
  
  renderApp();
  
  // Cleanup when the page is unloaded.
  window.addEventListener('pagehide', () => {
    activeController?.abort();
    cleanupEvents();
  });
  
  console.log('Exercise 3 initialized');
  