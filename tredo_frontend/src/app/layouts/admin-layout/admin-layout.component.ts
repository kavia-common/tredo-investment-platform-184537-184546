import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  // PUBLIC_INTERFACE
  /** Admin layout with topbar and content area. */
  links = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Overview', path: '/admin/overview' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Approvals', path: '/admin/approvals' },
    { label: 'Folios', path: '/admin/folios' },
    { label: 'Settings', path: '/admin/settings' },
  ];
}
