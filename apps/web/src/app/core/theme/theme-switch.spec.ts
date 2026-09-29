import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { provideInlineTranslations } from '../../testing/inline-translate';
import { AppTheme } from './theme';
import { ThemeService } from './theme.service';
import { ThemeSwitch } from './theme-switch';

describe('ThemeSwitch', () => {
  const current = signal<AppTheme>('dark');
  const use = vi.fn();
  let fixture: ComponentFixture<ThemeSwitch>;

  beforeEach(async () => {
    current.set('dark');
    use.mockClear();

    await TestBed.configureTestingModule({
      imports: [ThemeSwitch],
      providers: [
        ...provideInlineTranslations({
          en: { theme: { label: 'Theme', dark: 'Dark', light: 'Light' } },
        }),
        { provide: ThemeService, useValue: { current, use } },
      ],
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).get('theme.label'));
    fixture = TestBed.createComponent(ThemeSwitch);
    await fixture.whenStable();
  });

  it('marks the active theme and switches on click', () => {
    const buttons = [...fixture.nativeElement.querySelectorAll('button')] as HTMLButtonElement[];

    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Dark', 'Light']);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');

    buttons[1].click();

    expect(use).toHaveBeenCalledWith('light');
  });
});
