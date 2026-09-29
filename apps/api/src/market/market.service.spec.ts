import { ASSET_CATALOG } from './market.constants';
import { MarketService } from './market.service';
import { percentChange, stepPrice } from './price-step';

describe('MarketService', () => {
  let service: MarketService;

  beforeEach(() => {
    service = new MarketService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('starts from the catalog with a zero change', () => {
    const snapshot = service.snapshot();

    expect(snapshot.sequence).toBe(0);
    expect(snapshot.quotes).toEqual(
      ASSET_CATALOG.map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        price: asset.seedPrice,
        change: 0,
        changePercent: 0,
      })),
    );
    expect(snapshot.emittedAt).toEqual(expect.any(String));
  });

  it('moves every asset in the direction of the random shock', () => {
    jest.spyOn(Math, 'random').mockReturnValue(1);

    const next = service.advance();
    const expected = ASSET_CATALOG.map((asset) => {
      const price = stepPrice(asset.seedPrice, asset.volatility, 1);
      return {
        symbol: asset.symbol,
        price,
        change: Number((price - asset.seedPrice).toFixed(2)),
        changePercent: percentChange(asset.seedPrice, price),
      };
    });

    expect(next.sequence).toBe(1);
    expect(next.quotes).toEqual(
      expected.map((quote, index) => ({
        ...quote,
        name: ASSET_CATALOG[index].name,
      })),
    );
    expect(next.quotes.every((quote) => quote.changePercent > 0)).toBe(true);
  });

  it('keeps the latest prices for the next step and for snapshots', () => {
    const random = jest.spyOn(Math, 'random').mockReturnValue(0);

    const first = service.advance();
    const held = service.snapshot();

    expect(held.sequence).toBe(first.sequence);
    expect(held.quotes.map((quote) => quote.price)).toEqual(
      first.quotes.map((quote) => quote.price),
    );
    expect(first.quotes.every((quote) => quote.change < 0)).toBe(true);

    random.mockReturnValue(0.5);
    const second = service.advance();

    expect(second.sequence).toBe(2);
    expect(second.quotes.map((quote) => quote.change)).toEqual([0, 0, 0]);
  });
});
