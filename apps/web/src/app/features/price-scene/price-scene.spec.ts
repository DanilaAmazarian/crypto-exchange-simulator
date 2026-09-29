import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { MarketStateService } from '../../core/market/market-state.service';
import { PriceQuote } from '../../core/market/market.models';
import { provideInlineTranslations } from '../../testing/inline-translate';
import { MARKET_CUBE_SCENE, MarketCubeScene } from './cube-scene';
import { PriceScene } from './price-scene';

const dictionary = {
  scene: {
    title: 'BTC cube',
    waiting: 'Waiting for BTC',
    caption: '{{change}} · {{speed}} rad/s · {{direction}}',
    canvas: 'Rotating cube',
    direction: { up: 'up', down: 'down', flat: 'flat' },
  },
};

class FakeCube implements MarketCubeScene {
  readonly changes: number[] = [];
  started = false;
  disposed = false;

  setChangePercent(changePercent: number): void {
    this.changes.push(changePercent);
  }

  start(): void {
    this.started = true;
  }

  dispose(): void {
    this.disposed = true;
  }
}

describe('PriceScene', () => {
  const btc = signal<PriceQuote | null>(null);
  let cube: FakeCube;
  let fixture: ComponentFixture<PriceScene>;

  beforeEach(async () => {
    btc.set(null);
    cube = new FakeCube();

    await TestBed.configureTestingModule({
      imports: [PriceScene],
      providers: [
        ...provideInlineTranslations({ en: dictionary }),
        { provide: MarketStateService, useValue: { btcQuote: btc } },
        { provide: MARKET_CUBE_SCENE, useValue: () => cube },
      ],
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).get('scene.title'));
    fixture = TestBed.createComponent(PriceScene);
    await fixture.whenStable();
  });

  it('waits for BTC and starts the cube at a flat speed', () => {
    expect(fixture.nativeElement.textContent).toContain('Waiting for BTC');
    expect(cube.started).toBe(true);
    expect(cube.changes.at(-1)).toBe(0);
  });

  it('shows the signed speed and drives the cube from the BTC tick', () => {
    btc.set({ symbol: 'BTC', name: 'Bitcoin', price: 100, change: 0.2, changePercent: 0.2 });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('+0.200% · 1.75 rad/s · up');
    expect(cube.changes.at(-1)).toBe(0.2);

    fixture.destroy();
    expect(cube.disposed).toBe(true);
  });
});
