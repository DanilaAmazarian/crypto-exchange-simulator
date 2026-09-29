export const THEMES = ['dark', 'light'] as const;

export type AppTheme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = 'market.theme';

const ROOT_TOKENS = [
  'bg',
  'panel',
  'panel-2',
  'line',
  'text',
  'muted',
  'accent',
  'up',
  'down',
  'scene',
] as const;

export function isAppTheme(value: string | null | undefined): value is AppTheme {
  return value === 'dark' || value === 'light';
}

export function readInitialTheme(): AppTheme {
  if (typeof localStorage === 'undefined') {
    return 'dark';
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isAppTheme(stored) ? stored : 'dark';
}

/** Rebind semantic tokens on the document root. Elements keep using var(--bg) and do not change class. */
export function applyTheme(theme: AppTheme): void {
  const root = document.documentElement;
  root.style.colorScheme = theme;

  for (const token of ROOT_TOKENS) {
    root.style.setProperty(`--${token}`, `var(--palette-${theme}-${token})`);
  }
}

export function readRootToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
