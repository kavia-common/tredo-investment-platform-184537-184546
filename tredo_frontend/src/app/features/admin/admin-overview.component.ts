import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ChartPlaceholderComponent } from '../../shared';
import { AdminService } from '../../core/services/admin.service';

/**
 * PUBLIC_INTERFACE
 * AdminOverviewComponent - summarizes key platform metrics for operators.
 */
@Component({
  standalone: true,
  selector: 'app-admin-overview',
  imports: [CommonModule, CardComponent, ChartPlaceholderComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Admin Overview</h2>
      <span class="text-muted">Platform metrics</span>
    </header>

    <section style="display:grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap:.75rem; margin-bottom:.75rem">
      <app-card>
        <div>
          <div class="text-muted">Users</div>
          <div style="font-size:1.5rem; font-weight:700">{{ overviewData?.users ?? '—' }}</div>
        </div>
      </app-card>
      <app-card>
        <div>
          <div class="text-muted">Analyst Approvals Pending</div>
          <div style="font-size:1.5rem; font-weight:700">{{ overviewData?.analystsPending ?? '—' }}</div>
        </div>
      </app-card>
      <app-card>
        <div>
          <div class="text-muted">Folios</div>
          <div style="font-size:1.5rem; font-weight:700">{{ overviewData?.folios ?? '—' }}</div>
        </div>
      </app-card>
      <app-card>
        <div>
          <div class="text-muted">Revenue (₹)</div>
          <div style="font-size:1.5rem; font-weight:700">{{ overviewData?.revenue ?? '—' }}</div>
        </div>
      </app-card>
    </section>

    <section style="display:grid; grid-template-columns: 1.2fr .8fr; gap:.75rem">
      <app-card title="Activity">
        <app-chart-placeholder title="Platform Activity" subtitle="Last 30 days"></app-chart-placeholder>
      </app-card>
      <app-card title="Notes">
        <ul style="padding-left:1rem; line-height:1.8">
          <li>Use Approvals to process analyst applications.</li>
          <li>Use Users to manage roles and status.</li>
          <li>Folios Registry lists all analyst portfolios.</li>
        </ul>
      </app-card>
    </section>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOverviewComponent {
  private readonly admin = inject(AdminService);

  overviewData: { users: number; analystsPending: number; folios: number; revenue?: number } | null = null;

  ngOnInit(): void {
    this.admin.overview().subscribe((d) => (this.overviewData = d));
  }
}
