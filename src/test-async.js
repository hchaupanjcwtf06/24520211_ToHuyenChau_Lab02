
import assert from 'node:assert/strict';

import {
  STATUS,
  idleState,
  loadingState,
  successState,
  errorState,
  transition
} from './async-machine.js';

function testInitialState() {
  const state = idleState();

  assert.equal(state.status, STATUS.IDLE);
  console.log('PASS: IDLE state');
}

function testLoadingState() {
  const state = transition(
    idleState(),
    loadingState()
  );

  assert.equal(state.status, STATUS.LOADING);
  console.log('PASS: IDLE -> LOADING');
}

function testSuccessState() {
  const items = [
    { id: 1, title: 'Test item' }
  ];

  const state = transition(
    loadingState(),
    successState(items)
  );

  assert.equal(state.status, STATUS.SUCCESS);
  assert.equal(state.data.length, 1);

  console.log('PASS: LOADING -> SUCCESS');
}

function testErrorState() {
  const state = transition(
    loadingState(),
    errorState('Network failed')
  );

  assert.equal(state.status, STATUS.ERROR);
  assert.equal(state.error, 'Network failed');

  console.log('PASS: LOADING -> ERROR');
}

function testRetry() {
  const failedState = errorState('Network failed');

  const retryState = transition(
    failedState,
    loadingState()
  );

  assert.equal(retryState.status, STATUS.LOADING);

  console.log('PASS: ERROR -> LOADING');
}

function testInvalidTransition() {
  assert.throws(() => {
    transition(
      idleState(),
      successState([])
    );
  }, /Invalid transition/);

  console.log('PASS: Invalid transition rejected');
}

testInitialState();
testLoadingState();
testSuccessState();
testErrorState();
testRetry();
testInvalidTransition();

console.log('All async state tests passed');
