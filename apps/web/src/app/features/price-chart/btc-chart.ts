import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { sparklinePath } from './price-series';
import { PriceHistoryService } from './price-history.service';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 120;

@Component({
  selector: 'app-btc-chart',
  imports: [TranslatePipe],
  templateUrl: './btc-chart.html',
  styleUrl: './btc-chart.css',
})
export class BtcChart {
  private readonly history = inject(PriceHistoryService);

  readonly width = CHART_WIDTH;
  readonly height = CHART_HEIGHT;
  readonly path = computed(() => sparklinePath(this.history.btcSeries(), CHART_WIDTH, CHART_HEIGHT));
  readonly direction = computed(() => {
    const series = this.history.btcSeries();
    if (series.length < 2) {
      return 'flat';
    }
    const delta = series[series.length - 1].price - series[0].price;
    return delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  });
}
