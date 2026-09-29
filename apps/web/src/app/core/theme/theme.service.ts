import { Injectable, signal } from '@angular/core';
import { AppTheme, applyTheme, readInitialTheme, THEME_STORAGE_KEY } from './theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = signal<AppTheme>(readInitialTheme());

  readonly current = this.theme.asReadonly();

  constructor() {
    applyTheme(this.theme());
  }

  use(theme: AppTheme): void {
    this.theme.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  }
}
