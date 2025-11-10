import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent, FooterComponent } from '../../shared';
import { AuthService, User } from '../../core';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar [links]="links" brand="Tredo" (linkClick)="onNavClick($event)"></app-navbar>
    <section class="content">
      <router-outlet />
    </section>
    <app-footer brand="Tredo" [year]="footerYear"></app-footer>
  `,
  styleUrl: './public-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {
  // PUBLIC_INTERFACE
  /** Public layout with top navigation and footer, hosting public routes. */
  footerYear = new Date().getFullYear();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  user: User | null = null;

  links = this.computeLinks();

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.auth.me().subscribe({
        next: (u: User) => {
          this.user = u;
          this.links = this.computeLinks();
        },
        error: () => {
          this.links = this.computeLinks();
        }
      });
    }
  }

  private computeLinks(): Array<{ label: string; path: string }> {
    const base = [
      { label: 'Explore', path: '/explore' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'About', path: '/about' },
    ];
    if (this.auth.isAuthenticated()) {
      const role = this.user?.role;
      const dash = role === 'analyst' ? '/analyst'
        : role === 'admin' ? '/admin'
        : '/subscriber';
      return [
        ...base,
        { label: 'Dashboard', path: dash },
        { label: 'Logout', path: '/logout' },
      ];
    }
    return [...base, { label: 'Sign in', path: '/login' }];
  }

  onNavClick(link: { label: string; path: string | any[] }): void {
    if (String(link.label).toLowerCase() === 'logout') {
      this.auth.logout().subscribe({
        next: () => {
          this.user = null;
          this.links = this.computeLinks();
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.user = null;
          this.links = this.computeLinks();
          this.router.navigateByUrl('/');
        }
      });
    }
  }
}
