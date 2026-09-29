import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ConnectionStatus, MarketSnapshot } from './market.models';
import { MarketSocketService } from './market-socket.service';
import { MarketStateService } from './market-state.service';

describe('MarketStateService', () => {
  const snapshots$ = new Subject<MarketSnapshot>();
  const status$ = new Subject<ConnectionStatus>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MarketStateService,
        {
          provide: MarketSocketService,
          useValue: { snapshots$, status$ },
        },
      ],
    });
  });

  it('starts empty and projects the latest snapshot into signals', () => {
    const state = TestBed.inject(MarketStateService);

    expect(state.status()).toBe('connecting');
    expect(state.quotes()).toEqual([]);
    expect(state.sequence()).toBe(0);
    expect(state.btcQuote()).toBeNull();

    snapshots$.next({
      sequence: 4,
      emittedAt: '2026-09-29T08:00:00.000Z',
      quotes: [
        { symbol: 'ETH', name: 'Ethereum', price: 1, change: 0, changePercent: 0 },
        { symbol: 'BTC', name: 'Bitcoin', price: 2, change: 0.5, changePercent: 0.1 },
      ],
    });
    status$.next('live');

    expect(state.status()).toBe('live');
    expect(state.sequence()).toBe(4);
    expect(state.quotes()).toHaveLength(2);
    expect(state.btcQuote()?.price).toBe(2);
  });

  it('keeps the derived quotes tied to the snapshot signal', () => {
    const state = TestBed.inject(MarketStateService);
    const length = computed(() => state.quotes().length);

    snapshots$.next({
      sequence: 1,
      emittedAt: '2026-09-29T08:00:00.000Z',
      quotes: [{ symbol: 'SOL', name: 'Solana', price: 10, change: -1, changePercent: -0.2 }],
    });

    expect(length()).toBe(1);
    expect(state.btcQuote()).toBeNull();
  });
});
