import { AssetSymbol } from './market.types';

export const MARKET_NAMESPACE = '/market';

export const MARKET_TICK_EVENT = 'market.tick';

export const TICK_INTERVAL_MS = 500;

export interface AssetDefinition {
  symbol: AssetSymbol;
  name: string;
  seedPrice: number;
  /** Maximum fractional move per tick. 0.0015 = ±0.15%. */
  volatility: number;
}

export const ASSET_CATALOG: readonly AssetDefinition[] = [
  { symbol: 'BTC', name: 'Bitcoin', seedPrice: 67_420, volatility: 0.0015 },
  { symbol: 'ETH', name: 'Ethereum', seedPrice: 3_480, volatility: 0.002 },
  { symbol: 'SOL', name: 'Solana', seedPrice: 178, volatility: 0.0028 },
];
