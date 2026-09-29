import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { signal } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { AssetSymbol, MarketSnapshot } from '../../core/market/market.models';
import { MarketStateService } from '../../core/market/market-state.service';
import { PaperAccountService } from '../paper-account/paper-account.service';
import { languageStub, provideInlineTranslations } from '../../testing/inline-translate';
import { MarketBoard } from './market-board';

const dictionary = {
  board: {
    title: 'Quotes',
    tick: 'Tick {{sequence}} · {{time}}',
    waiting: 'Waiting for prices',
    pair: 'Pair',
    price: 'Price',
    change: 'Change',
    percent: '%',
  },
  status: {
    live: 'Online',
    offline: 'Disconnected',
    connecting: 'Connecting',
  },
  assets: {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    SOL: 'Solana',
  },
  account: {
    quantity: 'Quantity',
    trade: 'Trade',
    buy: 'Buy',
    sell: 'Sell',
  },
};

describe('MarketBoard', () => {
  const snapshot = signal<MarketSnapshot | null>(null);
  const status = signal<'connecting' | 'live' | 'offline'>('connecting');
  const buys: AssetSymbol[] = [];
  let fixture: ComponentFixture<MarketBoard>;

  beforeEach(async () => {
    snapshot.set(null);
    status.set('connecting');
    buys.length = 0;

    await TestBed.configureTestingModule({
      imports: [MarketBoard],
      providers: [
        ...provideInlineTranslations({ en: dictionary }),
        {
          provide: MarketStateService,
          useValue: {
            snapshot,
            status,
            sequence: () => snapshot()?.sequence ?? 0,
            quotes: () => snapshot()?.quotes ?? [],
          },
        },
        { provide: LanguageService, useValue: languageStub() },
        {
          provide: PaperAccountService,
          useValue: {
            notional: signal(100),
            quantity: () => 0.002,
            canBuy: () => true,
            canSell: () => false,
            buy: (symbol: AssetSymbol) => {
              buys.push(symbol);
              return null;
            },
            sell: () => 'insufficient-holdings',
          },
        },
      ],
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).get('board.title'));
    fixture = TestBed.createComponent(MarketBoard);
    await fixture.whenStable();
  });

  it('shows the waiting copy before the first tick', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Quotes');
    expect(text).toContain('Waiting for prices');
    expect(text).toContain('Connecting');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('renders formatted rows and their direction', () => {
    snapshot.set({
      sequence: 8,
      emittedAt: '2026-09-29T08:00:00.000Z',
      quotes: [
        { symbol: 'BTC', name: 'Bitcoin', price: 67420, change: 12.5, changePercent: 0.018 },
        { symbol: 'ETH', name: 'Ethereum', price: 3480, change: -2, changePercent: -0.05 },
      ],
    });
    status.set('live');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    const directions = [
      ...fixture.nativeElement.querySelectorAll('td[data-direction]'),
    ].map((cell: HTMLElement) => cell.dataset['direction']);

    expect(text).toContain('Tick 8');
    expect(text).toContain('Bitcoin');
    expect(text).toContain('$67,420.00');
    expect(text).toContain('+12.50');
    expect(text).toContain('Online');
    expect(text).toContain('0.002');
    expect(directions).toEqual(['up', 'up', 'down', 'down']);
  });

  it('buys the row at the current quote', () => {
    snapshot.set({
      sequence: 1,
      emittedAt: '2026-09-29T08:00:00.000Z',
      quotes: [{ symbol: 'BTC', name: 'Bitcoin', price: 50_000, change: 1, changePercent: 0.01 }],
    });
    fixture.detectChanges();

    const buy = fixture.nativeElement.querySelector('.trade__buy') as HTMLButtonElement;
    buy.click();

    expect(buys).toEqual(['BTC']);
    expect((fixture.nativeElement.querySelector('.trade__sell') as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});
