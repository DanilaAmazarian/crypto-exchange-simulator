import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/i18n/language.service';
import { MarketStateService } from '../../core/market/market-state.service';
import { PriceQuote } from '../../core/market/market.models';
import { formatClock, formatSigned, formatUsd } from '../../shared/format';

interface QuoteRow extends PriceQuote {
  priceLabel: string;
  changeLabel: string;
  percentLabel: string;
  direction: 'up' | 'down' | 'flat';
}

@Component({
  selector: 'app-market-board',
  imports: [TranslatePipe],
  templateUrl: './market-board.html',
  styleUrl: './market-board.css',
})
export class MarketBoard {
  private readonly market = inject(MarketStateService);
  private readonly language = inject(LanguageService);

  readonly status = this.market.status;
  readonly sequence = this.market.sequence;
  readonly updatedAt = computed(() => {
    const emittedAt = this.market.snapshot()?.emittedAt;
    return emittedAt ? formatClock(emittedAt, this.language.locale()) : '—';
  });

  readonly rows = computed<QuoteRow[]>(() =>
    this.market.quotes().map((quote) => ({
      ...quote,
      priceLabel: formatUsd(quote.price),
      changeLabel: formatSigned(quote.change, 2),
      percentLabel: `${formatSigned(quote.changePercent, 3)}%`,
      direction: quote.change > 0 ? 'up' : quote.change < 0 ? 'down' : 'flat',
    })),
  );
}
