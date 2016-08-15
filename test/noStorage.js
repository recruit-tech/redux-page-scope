import { add, locationChange } from './fixtures/actions';
import { default as test, assertCounter } from './_helpers';

test('initial state after push', [
  add(1),
  locationChange('PUSH', '1'),
  assertCounter(0),
]);

test('restore state after pop', [
  add(1),
  locationChange('PUSH', '1'),
  locationChange('POP', '0'),
  assertCounter(1),
]);

test('restore state after multiple pops', [
  add(1),
  locationChange('PUSH', '1'),
  add(2),
  locationChange('PUSH', '2'),
  add(3),
  locationChange('POP', '1'),
  assertCounter(2),
  locationChange('POP', '0'),
  assertCounter(1),
]);

test('initial state after replace', [
  add(1),
  locationChange('REPLACE', '1'),
  assertCounter(0),
]);
