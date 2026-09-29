import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PriceQuote } from '../../core/market/market.models';
import { MarketStateService } from '../../core/market/market-state.service';
import { PaperAccountService } from './paper-account.service';
import { PAPER_STORAGE_KEY } from './paper-ledger';

describe('PaperAccountService', () => {
  const quotes = signal<PriceQuote[]>([]);

  beforeEach(() => {
    localStorage.removeItem(PAPER_STORAGE_KEY);
    quotes.set([{ symbol: 'BTC', name: 'Bitcoin', price: 50_000, change: 0, changePercent: 0 }]);

    TestBed.configureTestingModule({
      providers: [{ provide: MarketStateService, useValue: { quotes } }],
    });
  });

  it('buys the current quote and remembers the account', () => {
    const account = TestBed.inject(PaperAccountService);

    expect(account.buy('BTC')).toBeNull();
    expect(account.valuation().cash).toBe(9900);
    expect(account.quantity('BTC')).toBe(0.002);
    expect(account.trades()[0]).toMatchObject({ side: 'buy', symbol: 'BTC', notional: 100 });
    expect(JSON.parse(localStorage.getItem(PAPER_STORAGE_KEY) ?? '{}').cash).toBe(9900);
  });

  it('updates profit when the latest price moves', () => {
    const account = TestBed.inject(PaperAccountService);
    account.buy('BTC');
    quotes.set([{ symbol: 'BTC', name: 'Bitcoin', price: 75_000, change: 1, changePercent: 1 }]);

    expect(account.valuation().pnl).toBe(50);
  });

  it('resets back to the starting cash', () => {
    const account = TestBed.inject(PaperAccountService);
    account.buy('BTC');

    account.reset();

    expect(account.valuation().cash).toBe(10_000);
    expect(account.quantity('BTC')).toBe(0);
    expect(account.trades()).toEqual([]);
  });
});
