import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/i18n/language.service';
import { AssetSymbol, PriceQuote } from '../../core/market/market.models';
import { MarketStateService } from '../../core/market/market-state.service';
import { PaperAccountService } from '../paper-account/paper-account.service';
import { formatClock, formatQty, formatSigned, formatUsd } from '../../shared/format';

interface QuoteRow extends PriceQuote {
  priceLabel: string;
  changeLabel: string;
  percentLabel: string;
  quantityLabel: string;
  direction: 'up' | 'down' | 'flat';
  canBuy: boolean;
  canSell: boolean;
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
  private readonly paper = inject(PaperAccountService);

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
      quantityLabel: formatQty(this.paper.quantity(quote.symbol)),
      direction: quote.change > 0 ? 'up' : quote.change < 0 ? 'down' : 'flat',
      canBuy: this.paper.canBuy(quote.symbol),
      canSell: this.paper.canSell(quote.symbol),
    })),
  );

  buy(symbol: AssetSymbol): void {
    this.paper.buy(symbol);
  }

  sell(symbol: AssetSymbol): void {
    this.paper.sell(symbol);
  }
}
