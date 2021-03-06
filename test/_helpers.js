import { test } from 'eater/runner';
import assert from 'assert';
import createStore from './fixtures/createStore';

const store = createStore();

export default function (name, steps, onExit) {
  test(name, () => {
    onExit && process.once('beforeExit', onExit);
    steps.forEach((step) => {
      if (typeof step === 'function') {
        step(store);
      } else {
        store.dispatch(step);
      }
    });
  });
}

export function assertCounter(expect) {
  return ({ getState }) => {
    assert(getState().page.counter.value === expect);
  };
}
