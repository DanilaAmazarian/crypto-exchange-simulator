import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { LANG_STORAGE_KEY } from './language';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  const currentLang = signal<string | null>(null);
  const translations = signal({});
  const setTitle = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    currentLang.set(null);
    setTitle.mockClear();

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        {
          provide: TranslateService,
          useValue: {
            currentLang: currentLang.asReadonly(),
            instant: (key: string) => `t:${key}`,
            use: (lang: string) => currentLang.set(lang),
          },
        },
        {
          provide: TranslateStore,
          useValue: { translations: translations.asReadonly() },
        },
        { provide: Title, useValue: { setTitle } },
      ],
    });
  });

  it('falls back to Russian until a language is selected', () => {
    const service = TestBed.inject(LanguageService);
    TestBed.flushEffects();

    expect(service.current()).toBe('ru');
    expect(service.locale()).toBe('ru-RU');
    expect(document.documentElement.lang).toBe('ru');
    expect(setTitle).toHaveBeenCalledWith('t:app.documentTitle');
  });

  it('switches the language and remembers the choice', () => {
    const service = TestBed.inject(LanguageService);

    service.use('en');
    TestBed.flushEffects();

    expect(service.current()).toBe('en');
    expect(service.locale()).toBe('en-US');
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});
