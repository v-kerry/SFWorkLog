/**
 * Common global state facility for state manangement and intercomponent communication.
 */
import Action from './action';
import Command from './command';

const defaultReducer = action => {
  // TODO: reduce
  switch(action.type) {
    default:
      break;
  }
  return action;
};

const __acresGlobalStore = {
  isDispatching: false,
  currentReducer: defaultReducer,
  currentListeners: null,
  nextListeners: [],
  currentReceivers: null,
  nextReceivers: [],
  state: {
      // use for this slot to maintain application state
  }
};

const getIsDispatching =  () => __acresGlobalStore.isDispatching;

const setIsDispatching = value => {
  __acresGlobalStore.isDispatching = value;
};

const getListeners = () => {
  if (!__acresGlobalStore.nextListeners) {
    __acresGlobalStore.nextListeners = [];
  }
  __acresGlobalStore.currentListeners = __acresGlobalStore.nextListeners;
  return __acresGlobalStore.currentListeners;
}

const resetListeners = () => {
  __acresGlobalStore.currentListeners = null;
};

 /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */
  const getMutatableNextListeners = () => {
  if (__acresGlobalStore.nextListeners === __acresGlobalStore.currentListeners) {
    __acresGlobalStore.nextListeners = __acresGlobalStore.currentListeners.slice();
  }
  return __acresGlobalStore.nextListeners;
};

const getReceivers = () => {
  if (!__acresGlobalStore.nextReceivers) {
    __acresGlobalStore.nextReceivers = [];
  }
  __acresGlobalStore.currentReceivers  = __acresGlobalStore.nextReceivers;
  return __acresGlobalStore.currentReceivers;
}

const resetReceivers = () => {
  __acresGlobalStore.currentReceivers = null;
};

const getMutatableNextReceivers = () => {
  if (__acresGlobalStore.nextReceivers  === __acresGlobalStore.currentReceivers) {
    __acresGlobalStore.nextReceivers = __acresGlobalStore.currentReceivers.slice();
  }
  return __acresGlobalStore.nextReceivers;
};

const getCurrentReducer = () => __acresGlobalStore.currentReducer;

const setCurrentReducer = reducer => {
  __acresGlobalStore.currentReducer = reducer;
};

/**
 * Returns current application state.
 */
const getState = () => {
  if (getIsDispatching()) {
    throw new Error(
      'You may not call store.getState() while the reducer is executing. ' +
        'The reducer has already received the state as an argument. ' +
        'Pass it down from the top reducer instead of reading it from the store.'
    );
  }  
  return __acresGlobalStore.state;
};

/**
 * Dispatches an action. It is the only way to trigger a state change.
 */
const dispatch = action => {
  if (!(action instanceof Action)) {
    throw new Error('Actions must be of type of Action.');
  }
  if (getIsDispatching()) {
    throw new Error('Reducers may not dispatch actions.')
  }  
  try {
    setIsDispatching(true);
    getCurrentReducer()(action);
  } finally {
    setIsDispatching(false);
  }  
  getListeners().forEach(l => l());
  return action;
};

 /**
  * Adds a change listener. It will be called any time an action is dispatched.
  * @param listener A callback to be invoked on every dispatch.
  * @returns A function to remove this change listener.
  */ 
const subscribe = listener => {
  if (typeof listener !== 'function') {
    throw new Error('Expected the listener to be a function.');
  }
  if (getIsDispatching()) {
    throw new Error(
      'You may not call store.subscribe() while the reducer is executing. ' +
        'If you would like to be notified after the store has been updated, subscribe from a ' +
        'component and invoke store.getState() in the callback to access the latest state.'
    );
  }
  let isSubscribed = true;
  let listeners = getMutatableNextListeners();
  listeners.push(listener);
  
  // A function to remove this change listener
  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }
    if (getIsDispatching()) {
      throw new Error(
        'You may not unsubscribe from a store listener while the reducer is executing.'
      );
    }
    isSubscribed = false;
    listeners = getMutatableNextListeners();
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
    resetListeners();
  }
};

 /**
   * Replaces the reducer currently used by the store to calculate the state.
   * @param nextReducer The reducer for the store to use instead.
   */
const replaceReducer = nextReducer => {
  if (typeof nextReducer !== 'function') {
    throw new Error('Expected the nextReducer to be a function.')
  }
  setCurrentReducer(nextReducer);
};

/**
 * Adds a receiver for Command invocation.
 * @param receiver function capable of handling Commands invocation.
 */
const registerReceiver = receiver => {
  if (typeof receiver !== 'function') {
    throw new Error('Expected the receiver to be a function.');
  }
  let isSubscribed = true;
  let receivers = getMutatableNextReceivers();
  receivers.push(receiver);
  
  // A function to remove this receiver
  return function unsubscribe() {
    if (!isSubscribed) {
      return;
    }
    isSubscribed = false;
    receivers = getMutatableNextReceivers();
    const index = receivers.indexOf(receiver);
    if (index >= 0) {
      receivers.splice(index, 1);
    }
    resetReceivers();
  }
};

/**
 * Invokes the specified Command for all registered receivers.
 * @param { Command } command
 * @returns A Promise that is resolved or rejected when all receivers are invoked (and complete).
 */
const invoke = command => {
  try {
    if (!(command instanceof Command)) {
      throw new Error('Actions must be of type of Command.');
    }
    const receivers = getReceivers();
    const promises = receivers.map(receiver => {
      let result = receiver(command);
      if (!(result instanceof Promise)) {
        result = Promise.resolve(result);
      }
      return result;
    });
    return Promise.all(promises);
  }catch(ex) {
    return Promise.reject(ex.message);
  }
};

export * from './constants';
export {
  Action,
  Command,
  getState,
  dispatch,
  subscribe,
  replaceReducer,
  registerReceiver,
  invoke
};