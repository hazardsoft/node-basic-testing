// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: 2, b: 3, action: Action.Multiply, expected: 6 },
  { a: 6, b: 3, action: Action.Divide, expected: 2 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 1, b: 2, action: '**', expected: null },
  { a: '1', b: 2, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('simpleCalculator({$a, $b, $action})', (input) => {
    expect(
      simpleCalculator({ a: input.a, b: input.b, action: input.action }),
    ).toBe(input.expected);
  });
});
