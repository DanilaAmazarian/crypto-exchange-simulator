import { percentChange, stepPrice } from './price-step';

describe('stepPrice', () => {
  it('keeps the price when the shock is zero', () => {
    expect(stepPrice(100, 0.1, 0.5)).toBe(100);
  });

  it('applies the full volatility at the random bounds', () => {
    expect(stepPrice(100, 0.1, 1)).toBe(110);
    expect(stepPrice(100, 0.1, 0)).toBe(90);
  });

  it('clamps a random sample that falls outside 0..1', () => {
    expect(stepPrice(100, 0.1, 2)).toBe(110);
    expect(stepPrice(100, 0.1, -1)).toBe(90);
  });
});

describe('percentChange', () => {
  it('returns a signed percentage', () => {
    expect(percentChange(200, 201)).toBe(0.5);
    expect(percentChange(200, 199)).toBe(-0.5);
  });

  it('returns zero when the previous price is zero', () => {
    expect(percentChange(0, 10)).toBe(0);
  });
});
