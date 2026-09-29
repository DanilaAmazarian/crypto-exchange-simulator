import { applyTrade, emptyLedger, markToMarket, readStoredLedger } from './paper-ledger';

describe('applyTrade', () => {
  it('buys at the quoted price and reduces cash', () => {
    const result = applyTrade(emptyLedger(), 'buy', 'BTC', 50_000, 100);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.ledger.cash).toBe(9900);
    expect(result.ledger.holdings).toEqual([{ symbol: 'BTC', quantity: 0.002, cost: 100 }]);
  });

  it('rejects a buy that costs more than the cash balance', () => {
    const result = applyTrade(emptyLedger(), 'buy', 'ETH', 3_000, 20_000);

    expect(result).toEqual({ ok: false, reason: 'insufficient-cash' });
  });

  it('sells a holding back into cash', () => {
    const bought = applyTrade(emptyLedger(), 'buy', 'SOL', 100, 100);
    expect(bought.ok).toBe(true);
    if (!bought.ok) {
      return;
    }

    const sold = applyTrade(bought.ledger, 'sell', 'SOL', 100, 100);
    expect(sold.ok).toBe(true);
    if (!sold.ok) {
      return;
    }

    expect(sold.ledger.cash).toBe(10_000);
    expect(sold.ledger.holdings).toEqual([]);
    expect(markToMarket(sold.ledger, new Map([['SOL', 100]])).pnl).toBe(0);
  });

  it('rejects a sell larger than the position', () => {
    const bought = applyTrade(emptyLedger(), 'buy', 'ETH', 2_000, 100);
    expect(bought.ok).toBe(true);
    if (!bought.ok) {
      return;
    }

    expect(applyTrade(bought.ledger, 'sell', 'ETH', 2_000, 250)).toEqual({
      ok: false,
      reason: 'insufficient-holdings',
    });
  });

  it('marks an open position to the latest price', () => {
    const bought = applyTrade(emptyLedger(), 'buy', 'BTC', 50_000, 100);
    expect(bought.ok).toBe(true);
    if (!bought.ok) {
      return;
    }

    const valuation = markToMarket(bought.ledger, new Map([['BTC', 60_000]]));

    expect(valuation.cash).toBe(9900);
    expect(valuation.equity).toBe(10_020);
    expect(valuation.pnl).toBe(20);
    expect(valuation.positions[0]).toMatchObject({ symbol: 'BTC', pnl: 20 });
  });
});

describe('readStoredLedger', () => {
  it('falls back to a fresh account when storage is empty or broken', () => {
    expect(readStoredLedger(null).cash).toBe(10_000);
    expect(readStoredLedger('{').cash).toBe(10_000);
    expect(readStoredLedger('{"cash":-1,"holdings":[]}').cash).toBe(10_000);
  });

  it('restores a saved account', () => {
    const raw = JSON.stringify({
      cash: 9500,
      holdings: [{ symbol: 'ETH', quantity: 0.1, cost: 500 }],
    });

    expect(readStoredLedger(raw)).toEqual({
      cash: 9500,
      holdings: [{ symbol: 'ETH', quantity: 0.1, cost: 500 }],
    });
  });
});
