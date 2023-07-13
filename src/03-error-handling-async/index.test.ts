// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    expect.assertions(6);
    await expect(resolveValue(4)).resolves.toBe(4);
    await expect(resolveValue('4')).resolves.toBe('4');
    await expect(resolveValue([4])).resolves.toEqual([4]);
    await expect(resolveValue(true)).resolves.toBe(true);
    await expect(resolveValue(null)).resolves.toBe(null);
    await expect(resolveValue(undefined)).resolves.toBe(undefined);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'message to be received';
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect.assertions(1);
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
