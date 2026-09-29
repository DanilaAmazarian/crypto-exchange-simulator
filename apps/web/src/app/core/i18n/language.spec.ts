import { isAppLang, LANG_STORAGE_KEY, readInitialLang } from './language';

describe('isAppLang', () => {
  it('accepts only the supported codes', () => {
    expect(isAppLang('ru')).toBe(true);
    expect(isAppLang('en')).toBe(true);
    expect(isAppLang('de')).toBe(false);
    expect(isAppLang(null)).toBe(false);
  });
});

describe('readInitialLang', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to Russian', () => {
    expect(readInitialLang()).toBe('ru');
  });

  it('restores a stored language and ignores an unknown value', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en');
    expect(readInitialLang()).toBe('en');

    localStorage.setItem(LANG_STORAGE_KEY, 'de');
    expect(readInitialLang()).toBe('ru');
  });
});
