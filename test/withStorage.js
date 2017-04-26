import { add, locationChange } from './fixtures/actions';
import assertStorage from './fixtures/storage';
import test, { assertCounter } from './_helpers';

test('initial state after push', [
  add(1),
  locationChange('PUSH', '1', '/foo'),
  assertCounter(0),
], assertStorage({ 0: 1 }));

test('restore state after pop', [
  add(1),
  locationChange('PUSH', '1', '/foo'),
  locationChange('POP', '0', '/'),
  assertCounter(1),
], assertStorage({ 0: 1, 1: 0 }));

test('restore state after multiple pops', [
  add(1),
  locationChange('PUSH', '1', '/foo'),
  add(2),
  locationChange('PUSH', '2', '/bar'),
  add(3),
  locationChange('POP', '1', 'foo'),
  assertCounter(2),
  locationChange('POP', '0', '/'),
  assertCounter(1),
], assertStorage({ 0: 1, 1: 2, 2: 3 }));

test('initial state after replace', [
  add(1),
  locationChange('PUSH', '1', '/foo'),
  locationChange('POP', '0', '/'),
  locationChange('REPLACE', '2', '/bar'),
  assertCounter(0),
], assertStorage({ 1: 0 }));

test('keep state after replace if path is not changed', [
  add(1),
  locationChange('PUSH', '1', '/foo'),
  locationChange('POP', '0', '/'),
  locationChange('REPLACE', '2', '/'),
  assertCounter(1),
], assertStorage({ 1: 0 }));
