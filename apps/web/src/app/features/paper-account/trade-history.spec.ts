import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { languageStub, provideInlineTranslations } from '../../testing/inline-translate';
import { LanguageService } from '../../core/i18n/language.service';
import { PaperTrade } from './paper-ledger';
import { PaperAccountService } from './paper-account.service';
import { TradeHistory } from './trade-history';

describe('TradeHistory', () => {
  const trades = signal<PaperTrade[]>([]);
  let fixture: ComponentFixture<TradeHistory>;

  beforeEach(async () => {
    trades.set([]);

    await TestBed.configureTestingModule({
      imports: [TradeHistory],
      providers: [
        ...provideInlineTranslations({
          en: {
            history: { title: 'Trades', empty: 'No trades yet' },
            account: { buy: 'Buy', sell: 'Sell' },
          },
        }),
        { provide: LanguageService, useValue: languageStub() },
        { provide: PaperAccountService, useValue: { trades } },
      ],
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).get('history.title'));
    fixture = TestBed.createComponent(TradeHistory);
    await fixture.whenStable();
  });

  it('shows an empty state before the first trade', () => {
    expect(fixture.nativeElement.textContent).toContain('No trades yet');
  });

  it('lists the newest trade first', () => {
    trades.set([
      {
        id: 1,
        side: 'buy',
        symbol: 'BTC',
        price: 50_000,
        notional: 100,
        quantity: 0.002,
        at: '2026-09-29T08:00:00.000Z',
      },
      {
        id: 2,
        side: 'sell',
        symbol: 'ETH',
        price: 3_000,
        notional: 100,
        quantity: 0.03,
        at: '2026-09-29T08:01:00.000Z',
      },
    ]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text.indexOf('ETH')).toBeLessThan(text.indexOf('BTC'));
    expect(text).toContain('Sell');
    expect(text).toContain('$3,000.00');
  });
});