
import {
    createElement,
    renderToDOM
  } from './mini-react.js';
  
  export function runRendererTests() {
    let passed = 0;
    let failed = 0;
  
    function test(name, condition) {
      if (condition) {
        console.log(`PASS: ${name}`);
        passed++;
      } else {
        console.error(`FAIL: ${name}`);
        failed++;
      }
    }
  
    const vnode = createElement(
      'main',
      { id: 'test-root' },
  
      createElement(
        'section',
        null,
  
        createElement(
          'p',
          null,
          '<script>alert(1)</script>'
        ),
  
        createElement(
          'button',
          {
            type: 'button',
            onClick: () => {
              window.__exercise1Clicked = true;
            }
          },
          'Test Button'
        )
      )
    );
  
    const dom = renderToDOM(vnode);
  
    test(
      'Main element created',
      dom.tagName === 'MAIN'
    );
  
    test(
      'Main ID assigned',
      dom.id === 'test-root'
    );
  
    test(
      'Section created',
      dom.querySelector('section') !== null
    );
  
    test(
      'Button created',
      dom.querySelector('button') !== null
    );
  
    test(
      'Script not injected',
      dom.querySelector('script') === null
    );
  
    test(
      'Unsafe text preserved',
      dom.querySelector('p').textContent ===
        '<script>alert(1)</script>'
    );
  
    window.__exercise1Clicked = false;
  
    dom.querySelector('button').click();
  
    test(
      'Click handler works',
      window.__exercise1Clicked === true
    );
  
    delete window.__exercise1Clicked;
  
    console.log(
      `Renderer tests: ${passed} passed, ${failed} failed`
    );
  
    if (failed > 0) {
      throw new Error('Renderer tests failed');
    }
  }  