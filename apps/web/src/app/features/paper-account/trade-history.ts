import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/i18n/language.service';
import { formatClock, formatQty, formatUsd } from '../../shared/format';
import { PaperAccountService } from './paper-account.service';

@Component({
  selector: 'app-trade-history',
  imports: [TranslatePipe],
  templateUrl: './trade-history.html',
  styleUrl: './trade-history.css',
})
export class TradeHistory {
  private readonly paper = inject(PaperAccountService);
  private readonly language = inject(LanguageService);

  readonly rows = computed(() =>
    this.paper.trades()
      .slice()
      .reverse()
      .map((trade) => ({
      ...trade,
      quantityLabel: formatQty(trade.quantity),
      priceLabel: formatUsd(trade.price),
      notionalLabel: formatUsd(trade.notional),
      timeLabel: formatClock(trade.at, this.language.locale()),
    })),
  );
}
