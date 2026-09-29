import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AppLang } from './language';
import { LanguageService } from './language.service';
import { LanguageSwitch } from './language-switch';
import { provideInlineTranslations } from '../../testing/inline-translate';

describe('LanguageSwitch', () => {
  const current = signal<AppLang>('ru');
  const use = vi.fn();
  let fixture: ComponentFixture<LanguageSwitch>;

  beforeEach(async () => {
    current.set('ru');
    use.mockClear();

    await TestBed.configureTestingModule({
      imports: [LanguageSwitch],
      providers: [
        ...provideInlineTranslations({ en: { lang: { label: 'Language' } } }),
        { provide: LanguageService, useValue: { current, use } },
      ],
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).get('lang.label'));
    fixture = TestBed.createComponent(LanguageSwitch);
    await fixture.whenStable();
  });

  it('marks the active language and switches on click', () => {
    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[];

    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['RU', 'EN']);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');

    buttons[1].click();

    expect(use).toHaveBeenCalledWith('en');
  });
});
