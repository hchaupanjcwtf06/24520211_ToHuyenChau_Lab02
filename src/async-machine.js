
/**
 * Lab 02 - Exercise 3
 * Four-state async data machine.
 */

export const STATUS = Object.freeze({
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  });
  
  export function idleState() {
    return Object.freeze({
      status: STATUS.IDLE
    });
  }
  
  export function loadingState() {
    return Object.freeze({
      status: STATUS.LOADING
    });
  }
  
  export function successState(data) {
    if (!Array.isArray(data)) {
      throw new TypeError(
        'SUCCESS state requires an array of items'
      );
    }
  
    return Object.freeze({
      status: STATUS.SUCCESS,
      data
    });
  }
  
  export function errorState(error) {
    return Object.freeze({
      status: STATUS.ERROR,
      error: String(error)
    });
  }
  
  /**
   * Only legal transitions are accepted.
   */
  const transitions = Object.freeze({
    IDLE: ['LOADING'],
    LOADING: ['SUCCESS', 'ERROR'],
    SUCCESS: ['LOADING'],
    ERROR: ['LOADING']
  });
  
  export function transition(currentState, nextState) {
    const allowed = transitions[currentState.status];
  
    if (!allowed || !allowed.includes(nextState.status)) {
      throw new Error(
        `Invalid transition: ${currentState.status} -> ${nextState.status}`
      );
    }
  
    return nextState;
  }
  