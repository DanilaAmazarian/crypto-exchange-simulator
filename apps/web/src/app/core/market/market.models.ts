/**
 * Wire contract for the `market.tick` event.
 * Keep in sync with `apps/api/src/market/market.types.ts`.
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

export type ConnectionStatus = 'connecting' | 'live' | 'offline';
