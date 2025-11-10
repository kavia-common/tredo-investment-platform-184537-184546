import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent, CardComponent } from '../../shared';

/**
 * PUBLIC_INTERFACE
 * NotFoundComponent - Displayed when a user navigates to an unknown route.
 */
@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="wrap">
      <app-card>
        <div class="body">
          <h1 class="code">404</h1>
          <h2 class="title">Page not found</h2>
          <p class="text-muted">The page you are looking for doesn't exist or has been moved.</p>

          <div class="actions">
            <a routerLink="/"><app-button variant="primary">Go Home</app-button></a>
            <a routerLink="/explore"><app-button variant="ghost">Explore Folios</app-button></a>
          </div>
        </div>
      </app-card>
    </section>
  `,
  styles: [`
    .wrap { display:grid; place-items:center; min-height: calc(100dvh - 160px); padding: 1rem; }
    .body { padding: 1rem; text-align: center; }
    .code { font-size: 3rem; font-weight: 800; color: var(--ocean-primary); margin-bottom: .25rem; }
    .title { font-weight: 700; margin-bottom: .25rem; }
    .actions { display:flex; gap:.5rem; justify-content:center; margin-top:.75rem; }
  `],
})
export class NotFoundComponent {}
