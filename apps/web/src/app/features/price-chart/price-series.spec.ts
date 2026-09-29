import { appendPricePoint, PRICE_WINDOW_MS, sparklinePath } from './price-series';

describe('appendPricePoint', () => {
  it('keeps only the last two minutes and ignores a repeated tick', () => {
    const first = appendPricePoint([], { at: 0, price: 100 });
    const same = appendPricePoint(first, { at: 0, price: 101 });
    const later = appendPricePoint(same, { at: PRICE_WINDOW_MS + 1, price: 110 }, PRICE_WINDOW_MS + 1);

    expect(same).toEqual([{ at: 0, price: 100 }]);
    expect(later).toEqual([{ at: PRICE_WINDOW_MS + 1, price: 110 }]);
  });
});

describe('sparklinePath', () => {
  it('draws a line from the first price to the last', () => {
    const path = sparklinePath(
      [
        { at: 0, price: 10 },
        { at: 1, price: 20 },
      ],
      100,
      40,
    );

    expect(path.startsWith('M 0.0')).toBe(true);
    expect(path).toContain('L 100.0');
  });
});
