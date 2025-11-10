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
    { label: 'Explore', path: '/explore' },
    { label: 'Pricing', path: '/pricing' },
  ];
  toggle() { this.collapsed = !this.collapsed; }
}
