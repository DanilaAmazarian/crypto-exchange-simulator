import { Provider, signal } from '@angular/core';
import {
  provideTranslateLoader,
  provideTranslateService,
  TranslateLoader,
  TranslationObject,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

class InlineTranslateLoader implements TranslateLoader {
  constructor(private readonly bundles: Record<string, TranslationObject>) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    return of(this.bundles[lang] ?? {});
  }
}

export function provideInlineTranslations(
  bundles: Record<string, TranslationObject>,
): Provider[] {
  return provideTranslateService({
    fallbackLang: 'en',
    lang: 'en',
    loader: provideTranslateLoader(() => new InlineTranslateLoader(bundles)),
  });
}

export function languageStub(locale = 'en-US') {
  return {
    current: signal('en'),
    locale: signal(locale),
    use: () => undefined,
  };
}
