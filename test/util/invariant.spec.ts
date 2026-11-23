// Adapted from the tiny-invariant v1.3.3 tests (MIT); see LICENSE.
import { expect, expectTypeOf, test, vi } from 'vitest';
import { invariant } from '../../src/util/LogUtils';

test('does not throw for truthy conditions', () => {
  const truthy: unknown[] = [1, -1, true, {}, [], Symbol('truthy'), 'hi', BigInt(1)];
  truthy.forEach(value => expect(() => invariant(value)).not.toThrow());
});

test('throws an Error with the default message for falsy conditions', () => {
  const falsy: unknown[] = [undefined, null, false, 0, -0, NaN, '', BigInt(0)];
  falsy.forEach(value => expect(() => invariant(value)).toThrow(new Error('Invariant failed')));
});

test('includes a nonempty message on failure', () => {
  expect(() => invariant(false, 'my message')).toThrow(new Error('Invariant failed: my message'));
  expect(() => invariant(false, '')).toThrow(new Error('Invariant failed'));
});

test('evaluates a lazy message only on failure', () => {
  const message = vi.fn(() => 'lazy message');
  invariant(true, message);
  expect(message).not.toHaveBeenCalled();
  expect(() => invariant(false, message)).toThrow(new Error('Invariant failed: lazy message'));
  expect(message).toHaveBeenCalledTimes(1);
  expect(() => invariant(false, () => '')).toThrow(new Error('Invariant failed'));
});

test('narrows a nullable value and a boolean', () => {
  function check(person: { name: string } | null, enabled: boolean): void {
    invariant(person);
    expectTypeOf(person).toEqualTypeOf<{ name: string }>();
    invariant(enabled);
    expectTypeOf(enabled).toEqualTypeOf<true>();
  }

  check({ name: 'Alex' }, true);
});

test('omits the message and does not evaluate it in production', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.resetModules();
  try {
    const { invariant: productionInvariant } = await import('../../src/util/LogUtils');
    const message = vi.fn(() => 'lazy message');
    expect(() => productionInvariant(false, message)).toThrow(new Error('Invariant failed'));
    expect(message).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllEnvs();
    vi.resetModules();
  }
});
