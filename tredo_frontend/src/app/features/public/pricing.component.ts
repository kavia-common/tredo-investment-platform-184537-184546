import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent, ButtonComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-pricing',
  imports: [CardComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid">
      <app-card title="Starter">
        <p>For new investors exploring folios.</p>
        <div class="mt"><app-button variant="primary">Choose Starter</app-button></div>
      </app-card>
      <app-card title="Pro">
        <p>For active subscribers following multiple analysts.</p>
        <div class="mt"><app-button variant="secondary">Choose Pro</app-button></div>
      </app-card>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
    .mt { margin-top: .75rem; }
  `],
})
export class PricingComponent {}
