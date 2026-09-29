import { AssetSymbol } from '../../core/market/market.models';

export const PAPER_STARTING_CASH = 10_000;
export const PAPER_STORAGE_KEY = 'market.paper';

const SYMBOLS = new Set<AssetSymbol>(['BTC', 'ETH', 'SOL']);

export interface PaperHolding {
  symbol: AssetSymbol;
  quantity: number;
  cost: number;
}

export interface PaperLedger {
  cash: number;
  holdings: PaperHolding[];
}

export const PAPER_TRADE_LIMIT = 12;

export type TradeSide = 'buy' | 'sell';

export interface PaperTrade {
  id: number;
  side: TradeSide;
  symbol: AssetSymbol;
  price: number;
  notional: number;
  quantity: number;
  at: string;
}
export type TradeReject = 'invalid-order' | 'insufficient-cash' | 'insufficient-holdings';

export interface MarkedPosition {
  symbol: AssetSymbol;
  quantity: number;
  marketValue: number;
  pnl: number;
}

export interface PaperValuation {
  cash: number;
  equity: number;
  pnl: number;
  positions: MarkedPosition[];
}

export function emptyLedger(): PaperLedger {
  return { cash: PAPER_STARTING_CASH, holdings: [] };
}

export function roundCash(value: number): number {
  return Math.round(value * 100) / 100;
}

export function roundQty(value: number): number {
  return Math.round(value * 1e8) / 1e8;
}

export function applyTrade(
  ledger: PaperLedger,
  side: TradeSide,
  symbol: AssetSymbol,
  price: number,
  notional: number,
): { ok: true; ledger: PaperLedger } | { ok: false; reason: TradeReject } {
  const spend = roundCash(notional);
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(spend) || spend <= 0) {
    return { ok: false, reason: 'invalid-order' };
  }

  const quantity = roundQty(spend / price);
  if (quantity <= 0) {
    return { ok: false, reason: 'invalid-order' };
  }

  const holdings = ledger.holdings.map((holding) => ({ ...holding }));
  const index = holdings.findIndex((holding) => holding.symbol === symbol);
  const current = index >= 0 ? holdings[index] : { symbol, quantity: 0, cost: 0 };

  if (side === 'buy') {
    if (roundCash(ledger.cash) + 1e-9 < spend) {
      return { ok: false, reason: 'insufficient-cash' };
    }

    const next = {
      symbol,
      quantity: roundQty(current.quantity + quantity),
      cost: roundCash(current.cost + spend),
    };
    if (index >= 0) {
      holdings[index] = next;
    } else {
      holdings.push(next);
    }

    return { ok: true, ledger: { cash: roundCash(ledger.cash - spend), holdings } };
  }

  if (current.quantity + 1e-12 < quantity) {
    return { ok: false, reason: 'insufficient-holdings' };
  }

  const nextQty = roundQty(current.quantity - quantity);
  const nextHoldings = holdings.filter((holding) => holding.symbol !== symbol);
  if (nextQty > 0) {
    const releasedCost = roundCash(current.cost * (quantity / current.quantity));
    nextHoldings.push({
      symbol,
      quantity: nextQty,
      cost: Math.max(0, roundCash(current.cost - releasedCost)),
    });
  }

  return { ok: true, ledger: { cash: roundCash(ledger.cash + spend), holdings: nextHoldings } };
}

export function markToMarket(
  ledger: PaperLedger,
  prices: ReadonlyMap<AssetSymbol, number>,
): PaperValuation {
  const positions = ledger.holdings
    .filter((holding) => holding.quantity > 0)
    .map((holding) => {
      const price = prices.get(holding.symbol);
      const hasPrice = price !== undefined && Number.isFinite(price) && price > 0;
      const marketValue = hasPrice ? roundCash(holding.quantity * price) : holding.cost;
      return {
        symbol: holding.symbol,
        quantity: holding.quantity,
        marketValue,
        pnl: roundCash(marketValue - holding.cost),
      };
    });
  const equity = roundCash(
    ledger.cash + positions.reduce((sum, position) => sum + position.marketValue, 0),
  );

  return {
    cash: ledger.cash,
    equity,
    pnl: roundCash(equity - PAPER_STARTING_CASH),
    positions,
  };
}

export function readStoredLedger(raw: string | null): PaperLedger {
  if (!raw) {
    return emptyLedger();
  }

  try {
    const parsed = JSON.parse(raw) as { cash?: unknown; holdings?: unknown };
    if (typeof parsed.cash !== 'number' || !Number.isFinite(parsed.cash) || parsed.cash < 0) {
      return emptyLedger();
    }
    if (!Array.isArray(parsed.holdings)) {
      return emptyLedger();
    }

    const holdings: PaperHolding[] = [];
    for (const item of parsed.holdings) {
      if (!item || typeof item !== 'object') {
        return emptyLedger();
      }
      const holding = item as PaperHolding;
      if (!SYMBOLS.has(holding.symbol)) {
        return emptyLedger();
      }
      if (typeof holding.quantity !== 'number' || typeof holding.cost !== 'number') {
        return emptyLedger();
      }
      if (!Number.isFinite(holding.quantity) || !Number.isFinite(holding.cost)) {
        return emptyLedger();
      }
      if (holding.quantity < 0 || holding.cost < 0) {
        return emptyLedger();
      }
      if (holding.quantity === 0) {
        continue;
      }
      holdings.push({
        symbol: holding.symbol,
        quantity: holding.quantity,
        cost: holding.cost,
      });
    }

    return { cash: roundCash(parsed.cash), holdings };
  } catch {
    return emptyLedger();
  }
}

export function rememberTrade(trades: PaperTrade[], trade: PaperTrade): PaperTrade[] {
  return [...trades, trade].slice(-PAPER_TRADE_LIMIT);
}

export function readStoredTrades(raw: string | null): PaperTrade[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as { trades?: unknown };
    if (!Array.isArray(parsed.trades)) {
      return [];
    }

    const trades: PaperTrade[] = [];
    for (const item of parsed.trades) {
      if (!item || typeof item !== 'object') {
        continue;
      }
      const trade = item as PaperTrade;
      if (trade.side !== 'buy' && trade.side !== 'sell') {
        continue;
      }
      if (!SYMBOLS.has(trade.symbol)) {
        continue;
      }
      if (
        typeof trade.id !== 'number' ||
        typeof trade.price !== 'number' ||
        typeof trade.notional !== 'number' ||
        typeof trade.quantity !== 'number' ||
        typeof trade.at !== 'string'
      ) {
        continue;
      }
      trades.push({
        id: trade.id,
        side: trade.side,
        symbol: trade.symbol,
        price: trade.price,
        notional: trade.notional,
        quantity: trade.quantity,
        at: trade.at,
      });
    }

    return trades.slice(-PAPER_TRADE_LIMIT);
  } catch {
    return [];
  }
}
