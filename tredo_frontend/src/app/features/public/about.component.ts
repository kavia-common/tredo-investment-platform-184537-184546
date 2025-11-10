import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card title="About Tredo">
      <p>Tredo connects SEBI-licensed analysts with subscribers via verified folios and trade recommendations.</p>
    </app-card>
  `,
})
export class AboutComponent {}
