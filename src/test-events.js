
import {
    createElement,
    renderToDOM
  } from './mini-react.js';
  
  import {
    setupEventDelegation
  } from './events.js';
  
  export function runEventTests() {
    const root = document.createElement('div');
  
    document.body.appendChild(root);
  
    let clickCount = 0;
  
    const vnode = createElement(
      'main',
      null,
  
      createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            clickCount++;
          }
        },
        'Test Click'
      )
    );
  
    const cleanup = setupEventDelegation(root);
  
    root.replaceChildren(
      renderToDOM(vnode, { delegateEvents: true })
    );
  
    const button = root.querySelector('button');
  
    button.click();
  
    if (clickCount !== 1) {
      throw new Error(
        'Delegated click failed'
      );
    }
  
    button.click();
  
    if (clickCount !== 2) {
      throw new Error(
        'Delegated click called wrong number of times'
      );
    }
  
    cleanup();
    root.remove();
  
    console.log('PASS: Root event delegation');
    console.log('PASS: Event handler called once per click');
    console.log('PASS: Event cleanup completed');
  }
  