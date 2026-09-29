import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { provideInlineTranslations } from '../../testing/inline-translate';
import { BtcChart } from './btc-chart';
import { PriceHistoryService } from './price-history.service';

describe('BtcChart', () => {
  const btcSeries = signal<{ at: number; price: number }[]>([]);
  let fixture: ComponentFixture<BtcChart>;

  beforeEach(async () => {
    btcSeries.set([]);

    await TestBed.configureTestingModule({
      imports: [BtcChart],
      providers: [
        ...provideInlineTranslations({
          en: {
            chart: {
              title: 'BTC chart',
              window: 'Last 2 minutes',
              waiting: 'Waiting for BTC',
              label: 'Bitcoin price',
            },
          },
        }),
        { provide: PriceHistoryService, useValue: { btcSeries } },
      ],
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).get('chart.title'));
    fixture = TestBed.createComponent(BtcChart);
    await fixture.whenStable();
  });

  it('waits until the first BTC tick', () => {
    expect(fixture.nativeElement.textContent).toContain('Waiting for BTC');
    expect(fixture.nativeElement.querySelector('path')).toBeNull();
  });

  it('draws the series and colors an upward move', () => {
    btcSeries.set([
      { at: 0, price: 100 },
      { at: 1, price: 110 },
    ]);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.dataset['direction']).toBe('up');
    expect(svg.querySelector('path')?.getAttribute('d')).toContain('M');
  });
});
