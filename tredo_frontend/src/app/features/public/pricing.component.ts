import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-pricing',
  imports: [CommonModule, CardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hdr">
      <h2>Pricing</h2>
      <p class="muted">Flexible plans for subscribers and analysts.</p>
    </section>

    <div class="plans">
      <app-card class="plan">
        <h3>Free</h3>
        <p class="muted">Browse public folios and limited insights.</p>
        <ul>
          <li>Public folios</li>
          <li>Basic analytics</li>
          <li>Community updates</li>
        </ul>
        <a routerLink="/register-subscriber" class="btn">Get started</a>
      </app-card>

      <app-card class="plan highlight">
        <h3>Subscriber</h3>
        <p class="muted">Unlock premium folios and alerts.</p>
        <ul>
          <li>Premium folio access</li>
          <li>Real-time trade alerts</li>
          <li>Performance tracking</li>
        </ul>
        <a routerLink="/register-subscriber" class="btn primary">Subscribe</a>
      </app-card>

      <app-card class="plan">
        <h3>Analyst</h3>
        <p class="muted">Publish folios and monetize your expertise.</p>
        <ul>
          <li>Folio publishing tools</li>
          <li>Subscriber management</li>
          <li>Payouts</li>
        </ul>
        <a routerLink="/register-analyst" class="btn">Become an analyst</a>
      </app-card>
    </div>
  `,
  styles: [`
    .hdr { margin-bottom: 1rem; }
    .muted { color: var(--ocean-muted); }
    .plans { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; }
    @media (max-width: 980px) { .plans { grid-template-columns: 1fr; } }
    .plan { padding: 1rem; display: grid; gap: .6rem; }
    .plan ul { padding-left: 1rem; display: grid; gap: .25rem; }
    .plan.highlight { border: 2px solid color-mix(in oklab, var(--ocean-primary) 30%, var(--ocean-border)); }
    .btn { text-decoration: none; width: fit-content; border: 1px solid var(--ocean-border); border-radius: var(--radius-md); padding: .45rem .7rem; color: var(--ocean-text); }
    .btn.primary { background: var(--ocean-primary); color: #fff; border-color: transparent; }
  `]
})
export class PricingComponent {}
