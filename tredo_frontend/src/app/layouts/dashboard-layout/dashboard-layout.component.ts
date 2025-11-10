import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
  links: Array<{ label: string; path: string }> = [];

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.links = this.computeLinks();
  }

  private computeLinks(): Array<{ label: string; path: string }> {
    let path = '/subscriber';
    try {
      const g = globalThis as unknown as { location?: { pathname?: string } };
      const p = g?.location?.pathname ?? '';
      if (typeof p === 'string' && p.startsWith('/analyst')) path = '/analyst';
      else if (typeof p === 'string' && p.startsWith('/admin')) path = '/admin';
      else if (typeof p === 'string' && p.startsWith('/subscriber')) path = '/subscriber';
    } catch { /* ignore SSR */ }

    if (path === '/analyst') {
      return [
        { label: 'Home', path: '/analyst' },
        { label: 'Folios', path: '/analyst/folios' },
        { label: 'New Folio', path: '/analyst/folios/new' },
        { label: 'Trades', path: '/analyst/trades' },
        { label: 'Analytics', path: '/analyst/analytics' },
      ];
    }

    if (path === '/admin') {
      return [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Overview', path: '/admin/overview' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Approvals', path: '/admin/approvals' },
        { label: 'Folios', path: '/admin/folios' },
        { label: 'Settings', path: '/admin/settings' },
      ];
    }

    // default subscriber
    return [
      { label: 'Home', path: '/subscriber' },
      { label: 'My Subscriptions', path: '/subscriber/my-subscriptions' },
      { label: 'Folio Tracker', path: '/subscriber/folio-tracker' },
      { label: 'Billing', path: '/subscriber/billing' },
      { label: 'Explore', path: '/explore' },
    ];
  }

  toggle() { this.collapsed = !this.collapsed; }
}
