import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MarketStateService } from '../../core/market/market-state.service';
import { readRootToken } from '../../core/theme/theme';
import { ThemeService } from '../../core/theme/theme.service';
import { formatSigned } from '../../shared/format';
import { angularSpeedFromChange } from './btc-rotation';
import { MARKET_CUBE_SCENE, MarketCubeScene } from './cube-scene';

@Component({
  selector: 'app-price-scene',
  imports: [TranslatePipe],
  templateUrl: './price-scene.html',
  styleUrl: './price-scene.css',
})
export class PriceScene {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('viewport');
  private readonly market = inject(MarketStateService);
  private readonly themes = inject(ThemeService);
  private readonly createScene = inject(MARKET_CUBE_SCENE);
  private scene?: MarketCubeScene;

  readonly hasQuote = computed(() => this.market.btcQuote() !== null);

  readonly changeLabel = computed(() => {
    const quote = this.market.btcQuote();
    return quote ? `${formatSigned(quote.changePercent, 3)}%` : '';
  });

  readonly speedLabel = computed(() => {
    const quote = this.market.btcQuote();
    return quote ? Math.abs(angularSpeedFromChange(quote.changePercent)).toFixed(2) : '';
  });

  readonly directionKey = computed(() => {
    const change = this.market.btcQuote()?.changePercent ?? 0;
    if (change > 0) {
      return 'scene.direction.up';
    }
    if (change < 0) {
      return 'scene.direction.down';
    }
    return 'scene.direction.flat';
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const scene = this.createScene(this.canvas().nativeElement);
      this.scene = scene;
      scene.setChangePercent(this.market.btcQuote()?.changePercent ?? 0);
      scene.setBackdrop(readRootToken('--scene'));
      scene.start();
      destroyRef.onDestroy(() => scene.dispose());
    });

    effect(() => {
      // Read the quote before the scene call. Optional chaining would skip the
      // signal read while the canvas is still being created, and the effect
      // would never run again.
      const changePercent = this.market.btcQuote()?.changePercent ?? 0;
      this.scene?.setChangePercent(changePercent);
    });

    effect(() => {
      this.themes.current();
      this.scene?.setBackdrop(readRootToken('--scene'));
    });
  }
}
