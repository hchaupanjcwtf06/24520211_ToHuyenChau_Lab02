
import {
    createElement,
    createTextElement,
    isVNode
  } from './mini-react.js';
  
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
  
  // Test 1: Text VNode
  const text = createTextElement('Hello');
  
  test(
    'Text element type',
    text.type === 'TEXT_ELEMENT'
  );
  
  test(
    'Text element value',
    text.props.nodeValue === 'Hello'
  );
  
  // Test 2: Number normalization
  const number = createTextElement(123);
  
  test(
    'Number converted to string',
    number.props.nodeValue === '123'
  );
  
  // Test 3: Element creation
  const element = createElement(
    'h1',
    { id: 'title' },
    'Hello World'
  );
  
  test(
    'Element type',
    element.type === 'h1'
  );
  
  test(
    'Element props',
    element.props.id === 'title'
  );
  
  // Test 4: Nested children
  const nested = createElement(
    'main',
    null,
    ['Hello', ['World', 42]]
  );
  
  test(
    'Nested children flattened',
    nested.props.children.length === 3
  );
  
  // Test 5: Ignore empty values
  const filtered = createElement(
    'section',
    null,
    null,
    undefined,
    false,
    true,
    'Visible'
  );
  
  test(
    'Empty children filtered',
    filtered.props.children.length === 1
  );
  
  // Test 6: Typeguard
  test(
    'Valid VNode accepted',
    isVNode(element)
  );
  
  test(
    'Invalid VNode rejected',
    !isVNode({ type: 'h1' })
  );
  
  // Test 7: Immutability
  test(
    'VNode is frozen',
    Object.isFrozen(element)
  );
  
  test(
    'Props are frozen',
    Object.isFrozen(element.props)
  );
  
  test(
    'Children array is frozen',
    Object.isFrozen(element.props.children)
  );
  
  // Test 8: Invalid child
  let invalidChildRejected = false;
  
  try {
    createElement('main', null, { invalid: true });
  } catch (error) {
    invalidChildRejected = error instanceof TypeError;
  }
  
  test(
    'Invalid child rejected',
    invalidChildRejected
  );
  
  console.log(
    `Factory tests: ${passed} passed, ${failed} failed`
  );
  
  if (failed > 0) {
    throw new Error('VNode factory tests failed');
  }
  