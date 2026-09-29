import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { readMarketSocketUrl } from './core/market/market-socket-url';
import { MARKET_SOCKET_URL } from './core/market/market.tokens';
import { readInitialLang } from './core/i18n/language';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'ru',
      lang: readInitialLang(),
      loader: provideTranslateLoader(TranslateHttpLoader),
    }),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        resources: [{ prefix: '/i18n/', suffix: '.json' }],
      },
    },
    { provide: MARKET_SOCKET_URL, useFactory: () => readMarketSocketUrl(window) },
  ],
};
