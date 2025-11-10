import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ChartPlaceholderComponent } from '../../shared';
import { AnalyticsService } from '../../core/services/analytics.service';

/**
 * PUBLIC_INTERFACE
 * AnalystAnalyticsComponent - Placeholder for advanced analytics and insights.
 */
@Component({
  standalone: true,
  selector: 'app-analyst-analytics',
  imports: [CommonModule, CardComponent, ChartPlaceholderComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Analytics</h2>
      <span class="text-muted">Insights and KPIs</span>
    </header>

    <section style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:.75rem">
      <app-card title="Subscribers Growth">
        <app-chart-placeholder title="Subscribers" subtitle="Last 90 days"></app-chart-placeholder>
      </app-card>
      <app-card title="Revenue (placeholder)">
        <app-chart-placeholder title="Revenue" subtitle="Coming soon"></app-chart-placeholder>
      </app-card>
      <app-card title="Trade Win-rate">
        <app-chart-placeholder title="Win-rate" subtitle="Last 6 months"></app-chart-placeholder>
      </app-card>
    </section>

    <section style="margin-top: .75rem; display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:.75rem">
      <app-card>
        <div>
          <div class="text-muted">Folios</div>
          <div style="font-size:1.5rem; font-weight:700">{{ summary?.folios ?? '—' }}</div>
        </div>
      </app-card>
      <app-card>
        <div>
          <div class="text-muted">Analysts</div>
          <div style="font-size:1.5rem; font-weight:700">{{ summary?.analysts ?? '—' }}</div>
        </div>
      </app-card>
      <app-card>
        <div>
          <div class="text-muted">Subscribers</div>
          <div style="font-size:1.5rem; font-weight:700">{{ summary?.subscribers ?? '—' }}</div>
        </div>
      </app-card>
    </section>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystAnalyticsComponent {
  private readonly analytics = inject(AnalyticsService);
  summary: { folios: number; analysts: number; subscribers: number } | null = null;

  ngOnInit(): void {
    this.analytics.getPlatformSummary().subscribe((s) => (this.summary = s));
  }
}
