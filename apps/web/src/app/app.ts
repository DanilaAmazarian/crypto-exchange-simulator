import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from './core/i18n/language.service';
import { LanguageSwitch } from './core/i18n/language-switch';
import { ThemeService } from './core/theme/theme.service';
import { ThemeSwitch } from './core/theme/theme-switch';
import { MarketBoard } from './features/market-board/market-board';
import { PaperAccount } from './features/paper-account/paper-account';
import { TradeHistory } from './features/paper-account/trade-history';
import { BtcChart } from './features/price-chart/btc-chart';
import { PriceScene } from './features/price-scene/price-scene';

@Component({
  selector: 'app-root',
  imports: [
    TranslatePipe,
    ThemeSwitch,
    LanguageSwitch,
    PaperAccount,
    MarketBoard,
    TradeHistory,
    PriceScene,
    BtcChart,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor() {
    inject(LanguageService);
    inject(ThemeService);
  }
}
