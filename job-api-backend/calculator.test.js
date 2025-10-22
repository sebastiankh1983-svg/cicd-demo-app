const { add, subtract, multiply, divide } = require('./calculator');

describe('Calculator Tests', () => {
  test('add(2, 3) sollte 5 zurückgeben', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('subtract(10, 3) sollte 7 zurückgeben', () => {
    expect(subtract(10, 3)).toBe(7);
  });

  test('multiply(4, 5) sollte 20 zurückgeben', () => {
    expect(multiply(4, 5)).toBe(20);
  });

  test('divide(10, 2) sollte 5 zurückgeben', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('divide(10, 0) sollte Error werfen', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
