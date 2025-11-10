import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  // PUBLIC_INTERFACE
  /** Dashboard layout with left side navigation and content area. */
  collapsed = false;
  toggle() { this.collapsed = !this.collapsed; }
}
