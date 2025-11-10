import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent, FooterComponent, CardComponent, ButtonComponent, ChartPlaceholderComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent, CardComponent, ButtonComponent, ChartPlaceholderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-navbar [links]="links" brand="Tredo">
      <span nav-actions>
        <app-button variant="primary" routerLink="/login">Sign in</app-button>
      </span>
    </app-navbar>

    <section class="hero">
      <div class="wrap">
        <h1>Invest with confidence</h1>
        <p class="text-muted">Connect with SEBI-licensed analysts and follow verified folios.</p>
        <div class="cta">
          <app-button variant="primary" routerLink="/explore">Explore folios</app-button>
          <app-button variant="ghost" routerLink="/pricing">View pricing</app-button>
        </div>
      </div>
    </section>

    <section class="section">
      <app-card title="Trending performance">
        <app-chart-placeholder title="Equity model" subtitle="Last 30 days"></app-chart-placeholder>
      </app-card>
    </section>

    <app-footer brand="Tredo"></app-footer>
  `,
  styles: [`
    .hero {
      background: var(--ocean-bg-gradient);
      padding: 2rem 1rem;
    }
    .wrap { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: clamp(1.8rem, 2.6vw, 2.4rem); margin-bottom: .5rem; }
    .cta { display: flex; gap: .5rem; margin-top: 1rem; }
    .section { max-width: 1100px; margin: 1rem auto; padding: 0 1rem; }
  `]
})
export class HomeComponent {
  links = [
    { label: 'Explore', path: '/explore' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];
}
