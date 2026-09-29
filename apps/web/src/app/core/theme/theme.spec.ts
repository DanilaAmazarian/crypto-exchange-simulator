import { applyTheme, isAppTheme, readInitialTheme, THEME_STORAGE_KEY } from './theme';

describe('isAppTheme', () => {
  it('accepts only the supported themes', () => {
    expect(isAppTheme('dark')).toBe(true);
    expect(isAppTheme('light')).toBe(true);
    expect(isAppTheme('blue')).toBe(false);
    expect(isAppTheme(null)).toBe(false);
  });
});

describe('readInitialTheme', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to the dark theme', () => {
    expect(readInitialTheme()).toBe('dark');
  });

  it('restores a stored theme and ignores an unknown value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(readInitialTheme()).toBe('light');

    localStorage.setItem(THEME_STORAGE_KEY, 'blue');
    expect(readInitialTheme()).toBe('dark');
  });
});

describe('applyTheme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
    document.documentElement.className = '';
  });

  it('rebinds root variables and does not add a class', () => {
    document.documentElement.className = 'kept';

    applyTheme('light');

    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(document.documentElement.style.getPropertyValue('--bg')).toBe('var(--palette-light-bg)');
    expect(document.documentElement.style.getPropertyValue('--scene')).toBe(
      'var(--palette-light-scene)',
    );
    expect(document.documentElement.className).toBe('kept');

    applyTheme('dark');

    expect(document.documentElement.style.getPropertyValue('--bg')).toBe('var(--palette-dark-bg)');
    expect(document.documentElement.className).toBe('kept');
  });
});
