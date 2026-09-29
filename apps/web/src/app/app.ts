import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from './core/i18n/language.service';
import { LanguageSwitch } from './core/i18n/language-switch';
import { MarketBoard } from './features/market-board/market-board';
import { PriceScene } from './features/price-scene/price-scene';

@Component({
  selector: 'app-root',
  imports: [TranslatePipe, LanguageSwitch, MarketBoard, PriceScene],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor() {
    inject(LanguageService);
  }
}
