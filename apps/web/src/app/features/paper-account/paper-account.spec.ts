import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { provideInlineTranslations } from '../../testing/inline-translate';
import { PaperAccount } from './paper-account';
import { PaperAccountService } from './paper-account.service';

const dictionary = {
  account: {
    title: 'Paper account',
    cash: 'Cash',
    equity: 'Equity',
    pnl: 'Result',
    notional: 'Order size',
    reset: 'Reset',
  },
};

describe('PaperAccount', () => {
  let fixture: ComponentFixture<PaperAccount>;
  const notional = signal(100);
  let resetCount = 0;

  beforeEach(async () => {
    resetCount = 0;
    notional.set(100);

    await TestBed.configureTestingModule({
      imports: [PaperAccount],
      providers: [
        ...provideInlineTranslations({ en: dictionary }),
        {
          provide: PaperAccountService,
          useValue: {
            notional,
            valuation: () => ({ cash: 9900, equity: 10_020, pnl: 20, positions: [] }),
            setNotional: (value: number) => notional.set(value),
            reset: () => {
              resetCount += 1;
            },
          },
        },
      ],
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).get('account.title'));
    fixture = TestBed.createComponent(PaperAccount);
    await fixture.whenStable();
  });

  it('shows cash, equity, and the marked result', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Paper account');
    expect(text).toContain('$9,900.00');
    expect(text).toContain('$10,020.00');
    expect(text).toContain('+$20.00');
    expect(fixture.nativeElement.querySelector('dd[data-direction="up"]')).not.toBeNull();
  });

  it('resets the account from the button', () => {
    const button = fixture.nativeElement.querySelector('button.reset') as HTMLButtonElement;
    button.click();

    expect(resetCount).toBe(1);
  });
});
