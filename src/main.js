
/**
 * Lab 02 - Exercise 1
 * VNode Mounting Demo
 */

import {
  createElement,
  renderToDOM
} from './mini-react.js';

import './style.css';
import { runRendererTests } from './test-renderer.js';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Root element #app was not found');
}

const vApp = createElement(
  'main',
  {
    id: 'root-view',
    role: 'main',
    className: 'app-container'
  },

  createElement(
    'header',
    { className: 'hero' },

    createElement(
      'h1',
      null,
      'Mini React Engine'
    ),

    createElement(
      'p',
      null,
      'Exercise 1: Virtual DOM & Mounting Engine'
    ),

    createElement(
      'p',
      { className: 'security-text' },
      '<img src=x onerror=alert(1)> Safe Text'
    ),

    createElement(
      'p',
      null,
      '<script>alert(1)</script>'
    )
  ),

  createElement(
    'section',
    {
      className: 'demo-section',
      'aria-label': 'Interactive demonstration'
    },

    createElement(
      'h2',
      null,
      'DOM Mounting Test'
    ),

    createElement(
      'p',
      null,
      'This interface is generated from VNodes.'
    ),

    createElement(
      'button',
      {
        id: 'ping-button',
        type: 'button',
        onClick: () => console.log('Ping')
      },
      'Click'
    )
  ),

  createElement(
    'section',
    {
      className: 'demo-section',
      'aria-label': 'Engine information'
    },

    createElement(
      'h2',
      null,
      'Engine Features'
    ),

    createElement(
      'ul',
      null,

      createElement(
        'li',
        null,
        'VNode factory'
      ),

      createElement(
        'li',
        null,
        'Text normalization'
      ),

      createElement(
        'li',
        null,
        'Recursive DOM mounting'
      ),

      createElement(
        'li',
        null,
        'Safe text rendering'
      )
    )
  )
);

// Mount VNode tree into the real DOM.
root.replaceChildren(renderToDOM(vApp));

// Basic runtime verification.
console.assert(
  root.querySelector('main') !== null,
  'Main element missing'
);

console.assert(
  root.querySelector('section') !== null,
  'Section element missing'
);

console.assert(
  root.querySelector('button') !== null,
  'Button element missing'
);

console.assert(
  root.querySelector('img') === null,
  'Unexpected image element created'
);

console.assert(
  root.querySelector('script') === null,
  'Unexpected script element created'
);

console.log('Exercise 1 mounted successfully');
runRendererTests();