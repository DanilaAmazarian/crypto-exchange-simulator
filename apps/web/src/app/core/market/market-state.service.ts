import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketSocketService } from './market-socket.service';

@Injectable({ providedIn: 'root' })
export class MarketStateService {
  private readonly socket = inject(MarketSocketService);

  readonly snapshot = toSignal(this.socket.snapshots$, { initialValue: null });
  readonly status = toSignal(this.socket.status$, { initialValue: 'connecting' });

  readonly quotes = computed(() => this.snapshot()?.quotes ?? []);
  readonly sequence = computed(() => this.snapshot()?.sequence ?? 0);
  readonly btcQuote = computed(
    () => this.quotes().find((quote) => quote.symbol === 'BTC') ?? null,
  );
}
