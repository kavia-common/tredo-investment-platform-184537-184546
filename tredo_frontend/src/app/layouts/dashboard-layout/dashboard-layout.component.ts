import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../../shared';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  // PUBLIC_INTERFACE
  /** Dashboard layout with left side navigation and content area. */
  collapsed = false;
  links = [
    { label: 'Home', path: '/subscriber' },
    { label: 'My Subscriptions', path: '/subscriber/my-subscriptions' },
    { label: 'Folio Tracker', path: '/subscriber/folio-tracker' },
    { label: 'Billing', path: '/subscriber/billing' },
    { label: 'Explore', path: '/explore' },
  ];

  /**
   * When used for /analyst shell, the child routes will still render,
   * and links can be overridden in future via @Input or route data.
   * For now, we detect URL pattern at runtime is avoided to keep SSR-safe and simple.
   */
  toggle() { this.collapsed = !this.collapsed; }
}
