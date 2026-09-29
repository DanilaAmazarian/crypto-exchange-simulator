import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY } from './theme';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('style');
  });

  it('applies the stored theme and remembers a switch', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    const service = TestBed.inject(ThemeService);

    expect(service.current()).toBe('light');
    expect(document.documentElement.style.getPropertyValue('--panel')).toBe(
      'var(--palette-light-panel)',
    );

    service.use('dark');

    expect(service.current()).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
