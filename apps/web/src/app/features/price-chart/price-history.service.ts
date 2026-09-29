import { effect, inject, Injectable, signal } from '@angular/core';
import { MarketStateService } from '../../core/market/market-state.service';
import { appendPricePoint, PricePoint } from './price-series';

@Injectable({ providedIn: 'root' })
export class PriceHistoryService {
  private readonly market = inject(MarketStateService);
  private readonly points = signal<PricePoint[]>([]);

  readonly btcSeries = this.points.asReadonly();

  constructor() {
    effect(() => {
      const snapshot = this.market.snapshot();
      const btc = snapshot?.quotes.find((quote) => quote.symbol === 'BTC');
      if (!snapshot || !btc) {
        return;
      }

      const at = Date.parse(snapshot.emittedAt);
      this.points.update((current) => appendPricePoint(current, { at, price: btc.price }));
    });
  }
}
