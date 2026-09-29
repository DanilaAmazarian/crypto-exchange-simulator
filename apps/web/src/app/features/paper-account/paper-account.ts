import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { formatSignedUsd, formatUsd } from '../../shared/format';
import { PaperAccountService } from './paper-account.service';

@Component({
  selector: 'app-paper-account',
  imports: [TranslatePipe],
  templateUrl: './paper-account.html',
  styleUrl: './paper-account.css',
})
export class PaperAccount {
  private readonly paper = inject(PaperAccountService);

  readonly notional = this.paper.notional;
  readonly cashLabel = computed(() => formatUsd(this.paper.valuation().cash));
  readonly equityLabel = computed(() => formatUsd(this.paper.valuation().equity));
  readonly pnlLabel = computed(() => formatSignedUsd(this.paper.valuation().pnl));
  readonly pnlDirection = computed(() => {
    const pnl = this.paper.valuation().pnl;
    return pnl > 0 ? 'up' : pnl < 0 ? 'down' : 'flat';
  });

  onNotional(event: Event): void {
    this.paper.setNotional((event.target as HTMLInputElement).valueAsNumber);
  }

  reset(): void {
    this.paper.reset();
  }
}
