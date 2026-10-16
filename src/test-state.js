
import {
    resetCursor,
    getCursor,
    setRenderer,
    useState
  } from './state.js';
  
  import assert from 'node:assert/strict';
  
  let renderCount = 0;
  
  setRenderer(() => {
    renderCount += 1;
  });
  
  // First render
  resetCursor();
  
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('ALL');
  
  assert.equal(count, 0);
  assert.equal(filter, 'ALL');
  assert.equal(getCursor(), 2);
  
  console.log('PASS: Initial state');
  
  // Update first hook
  setCount(previous => previous + 1);
  
  assert.equal(renderCount, 1);
  
  resetCursor();
  
  const [updatedCount] = useState(0);
  const [unchangedFilter] = useState('ALL');
  
  assert.equal(updatedCount, 1);
  assert.equal(unchangedFilter, 'ALL');
  
  console.log('PASS: State persists after render');
  
  // Update second hook
  setFilter('ACTIVE');
  
  assert.equal(renderCount, 2);
  
  resetCursor();
  
  const [finalCount] = useState(0);
  const [finalFilter] = useState('ALL');
  
  assert.equal(finalCount, 1);
  assert.equal(finalFilter, 'ACTIVE');
  
  console.log('PASS: Independent hook slots');
  
  // Same value must not trigger render
  setFilter('ACTIVE');
  
  assert.equal(renderCount, 2);
  
  console.log('PASS: No unnecessary render');
  
  console.log('All state tests passed');
  