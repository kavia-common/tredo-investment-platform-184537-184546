import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent, ButtonComponent } from '../../shared';

/**
 * PUBLIC_INTERFACE
 * AdminDashboardComponent - Landing for admin console with quick links.
 */
@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Admin Console</h2>
      <span class="text-muted">Platform operations</span>
    </header>

    <section style="display:grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap:.75rem">
      <app-card title="Overview">
        <p class="text-muted">Key metrics and activity</p>
        <div card-footer>
          <a routerLink="overview"><app-button variant="primary">Open Overview</app-button></a>
        </div>
      </app-card>

      <app-card title="Users">
        <p class="text-muted">Manage platform users</p>
        <div card-footer>
          <a routerLink="users"><app-button variant="primary">Manage Users</app-button></a>
        </div>
      </app-card>

      <app-card title="Approvals">
        <p class="text-muted">Analyst applications queue</p>
        <div card-footer>
          <a routerLink="approvals"><app-button variant="primary">Review Approvals</app-button></a>
        </div>
      </app-card>

      <app-card title="Folios Registry">
        <p class="text-muted">All analyst folios</p>
        <div card-footer>
          <a routerLink="folios"><app-button variant="primary">View Folios</app-button></a>
        </div>
      </app-card>

      <app-card title="Settings">
        <p class="text-muted">Platform configuration</p>
        <div card-footer>
          <a routerLink="settings"><app-button variant="primary">Open Settings</app-button></a>
        </div>
      </app-card>
    </section>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {}
