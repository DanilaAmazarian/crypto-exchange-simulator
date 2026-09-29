export const SUPPORTED_LANGS = ['ru', 'en'] as const;

export type AppLang = (typeof SUPPORTED_LANGS)[number];

export const LANG_STORAGE_KEY = 'market.lang';

export const LANG_LOCALE: Record<AppLang, string> = {
  ru: 'ru-RU',
  en: 'en-US',
};

export function isAppLang(value: string | null | undefined): value is AppLang {
  return value === 'ru' || value === 'en';
}

export function readInitialLang(): AppLang {
  if (typeof localStorage === 'undefined') {
    return 'ru';
  }

  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return isAppLang(stored) ? stored : 'ru';
}
