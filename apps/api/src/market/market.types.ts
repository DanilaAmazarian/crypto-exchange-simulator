/**
 * Wire contract for the `market.tick` event.
 * Keep in sync with `apps/web/src/app/core/market/market.models.ts`.
 */
export type AssetSymbol = 'BTC' | 'ETH' | 'SOL';

export interface PriceQuote {
  symbol: AssetSymbol;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface MarketSnapshot {
  sequence: number;
  emittedAt: string;
  quotes: PriceQuote[];
}
