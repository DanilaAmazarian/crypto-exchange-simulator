import { computed, effect, inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { AppLang, isAppLang, LANG_LOCALE, LANG_STORAGE_KEY } from './language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly store = inject(TranslateStore);
  private readonly title = inject(Title);

  readonly current = computed<AppLang>(() => {
    const lang = this.translate.currentLang();
    return isAppLang(lang) ? lang : 'ru';
  });

  readonly locale = computed(() => LANG_LOCALE[this.current()]);

  constructor() {
    effect(() => {
      const lang = this.current();
      this.store.translations();
      document.documentElement.lang = lang;
      this.title.setTitle(String(this.translate.instant('app.documentTitle')));
    });
  }

  use(lang: AppLang): void {
    this.translate.use(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
}
