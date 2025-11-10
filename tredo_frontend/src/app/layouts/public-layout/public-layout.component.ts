import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent, FooterComponent } from '../../shared';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar [links]="links" brand="Tredo"></app-navbar>
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
  links = [
    { label: 'Explore', path: '/explore' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Sign in', path: '/login' },
  ];
}
