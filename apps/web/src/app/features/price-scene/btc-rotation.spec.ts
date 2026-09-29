import { angularSpeedFromChange, colorForChange } from './btc-rotation';

describe('angularSpeedFromChange', () => {
  it('uses the base speed when the price is unchanged', () => {
    expect(angularSpeedFromChange(0)).toBeCloseTo(0.35);
  });

  it('spins faster and follows the sign of the tick', () => {
    const up = angularSpeedFromChange(0.2);
    const down = angularSpeedFromChange(-0.2);

    expect(up).toBeCloseTo(1.75);
    expect(down).toBeCloseTo(-1.75);
    expect(Math.abs(up)).toBeGreaterThan(Math.abs(angularSpeedFromChange(0)));
  });

  it('caps the contribution of a very large change', () => {
    expect(angularSpeedFromChange(4)).toBeCloseTo(angularSpeedFromChange(1));
  });
});

describe('colorForChange', () => {
  it('picks green, red, or blue from the tick direction', () => {
    expect(colorForChange(0.1)).toBe(0x3dd68c);
    expect(colorForChange(-0.1)).toBe(0xff6b7a);
    expect(colorForChange(0)).toBe(0x8eb6ff);
  });
});
