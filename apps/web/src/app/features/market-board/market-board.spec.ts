import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { signal } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { MarketSnapshot } from '../../core/market/market.models';
import { MarketStateService } from '../../core/market/market-state.service';
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
};

describe('MarketBoard', () => {
  const snapshot = signal<MarketSnapshot | null>(null);
  const status = signal<'connecting' | 'live' | 'offline'>('connecting');
  let fixture: ComponentFixture<MarketBoard>;

  beforeEach(async () => {
    snapshot.set(null);
    status.set('connecting');

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
    expect(directions).toEqual(['up', 'up', 'down', 'down']);
  });
});
