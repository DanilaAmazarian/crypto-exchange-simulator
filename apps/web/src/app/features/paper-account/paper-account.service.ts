import { computed, inject, Injectable, signal } from '@angular/core';
import { AssetSymbol } from '../../core/market/market.models';
import { MarketStateService } from '../../core/market/market-state.service';
import {
  applyTrade,
  emptyLedger,
  PAPER_STORAGE_KEY,
  PaperLedger,
  PaperTrade,
  PaperValuation,
  readStoredLedger,
  readStoredTrades,
  rememberTrade,
  roundQty,
  markToMarket,
  TradeReject,
} from './paper-ledger';

@Injectable({ providedIn: 'root' })
export class PaperAccountService {
  private readonly market = inject(MarketStateService);
  private readonly ledger = signal<PaperLedger>(this.readLedger());
  private readonly tradeLog = signal<PaperTrade[]>(this.readTrades());

  readonly notional = signal(100);
  readonly trades = this.tradeLog.asReadonly();
  readonly valuation = computed<PaperValuation>(() => {
    const prices = new Map<AssetSymbol, number>();
    for (const quote of this.market.quotes()) {
      prices.set(quote.symbol, quote.price);
    }
    return markToMarket(this.ledger(), prices);
  });

  setNotional(value: number): void {
    if (!Number.isFinite(value) || value <= 0) {
      this.notional.set(0);
      return;
    }
    this.notional.set(Math.round(value * 100) / 100);
  }

  quantity(symbol: AssetSymbol): number {
    return this.ledger().holdings.find((holding) => holding.symbol === symbol)?.quantity ?? 0;
  }

  canBuy(symbol: AssetSymbol): boolean {
    return applyTrade(this.ledger(), 'buy', symbol, this.price(symbol), this.notional()).ok;
  }

  canSell(symbol: AssetSymbol): boolean {
    return applyTrade(this.ledger(), 'sell', symbol, this.price(symbol), this.notional()).ok;
  }

  buy(symbol: AssetSymbol): TradeReject | null {
    return this.trade('buy', symbol);
  }

  sell(symbol: AssetSymbol): TradeReject | null {
    return this.trade('sell', symbol);
  }

  reset(): void {
    this.ledger.set(emptyLedger());
    this.tradeLog.set([]);
    this.persist();
  }

  private trade(side: 'buy' | 'sell', symbol: AssetSymbol): TradeReject | null {
    const price = this.price(symbol);
    const notional = this.notional();
    const result = applyTrade(this.ledger(), side, symbol, price, notional);
    if (!result.ok) {
      return result.reason;
    }

    const quantity = roundQty(notional / price);
    this.ledger.set(result.ledger);
    this.tradeLog.update((trades) =>
      rememberTrade(trades, {
        id: Date.now(),
        side,
        symbol,
        price,
        notional,
        quantity,
        at: new Date().toISOString(),
      }),
    );
    this.persist();
    return null;
  }

  private price(symbol: AssetSymbol): number {
    return this.market.quotes().find((quote) => quote.symbol === symbol)?.price ?? 0;
  }

  private readLedger(): PaperLedger {
    if (typeof localStorage === 'undefined') {
      return emptyLedger();
    }
    return readStoredLedger(localStorage.getItem(PAPER_STORAGE_KEY));
  }

  private readTrades(): PaperTrade[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    return readStoredTrades(localStorage.getItem(PAPER_STORAGE_KEY));
  }

  private persist(): void {
    localStorage.setItem(
      PAPER_STORAGE_KEY,
      JSON.stringify({ ...this.ledger(), trades: this.tradeLog() }),
    );
  }
}
