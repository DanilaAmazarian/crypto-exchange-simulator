import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SUPPORTED_LANGS } from './language';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-language-switch',
  imports: [TranslatePipe],
  templateUrl: './language-switch.html',
  styleUrl: './language-switch.css',
})
export class LanguageSwitch {
  private readonly language = inject(LanguageService);

  readonly langs = SUPPORTED_LANGS;
  readonly current = this.language.current;

  use(lang: (typeof SUPPORTED_LANGS)[number]): void {
    this.language.use(lang);
  }
}
