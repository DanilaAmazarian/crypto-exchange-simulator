import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { applyTheme, readInitialTheme } from './app/core/theme/theme';

applyTheme(readInitialTheme());

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
