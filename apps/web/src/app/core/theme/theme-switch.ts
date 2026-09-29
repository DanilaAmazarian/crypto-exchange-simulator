import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { THEMES } from './theme';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-switch',
  imports: [TranslatePipe],
  templateUrl: './theme-switch.html',
  styleUrl: './theme-switch.css',
})
export class ThemeSwitch {
  private readonly themes = inject(ThemeService);

  readonly options = THEMES;
  readonly current = this.themes.current;

  use(theme: (typeof THEMES)[number]): void {
    this.themes.use(theme);
  }
}
