import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent, ChartPlaceholderComponent, ButtonComponent, TableComponent } from '../../shared';
import { AnalyticsService } from '../../core/services/analytics.service';
import { FolioService } from '../../core/services/folio.service';
import { Folio } from '../../core';

@Component({
  standalone: true,
  selector: 'app-analyst-dashboard',
  imports: [CommonModule, RouterLink, CardComponent, ChartPlaceholderComponent, ButtonComponent, TableComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom: .75rem;">
      <h2>Analyst Dashboard</h2>
      <span class="text-muted">Overview</span>
      <span class="spacer" style="flex:1"></span>
      <a routerLink="/analyst/folios/new"><app-button variant="primary">New Folio</app-button></a>
    </header>

    <section style="display:grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: .75rem; margin-bottom: .75rem;">
      <app-card>
        <div card-actions></div>
        <div>
          <div class="text-muted">Total Folios</div>
          <div style="font-size:1.5rem; font-weight:700">{{ summary?.folios ?? '—' }}</div>
        </div>
      </app-card>

      <app-card>
        <div>
          <div class="text-muted">Subscribers</div>
          <div style="font-size:1.5rem; font-weight:700">{{ summary?.subscribers ?? '—' }}</div>
        </div>
      </app-card>

      <app-card>
        <div>
          <div class="text-muted">Analysts</div>
          <div style="font-size:1.5rem; font-weight:700">{{ summary?.analysts ?? '—' }}</div>
        </div>
      </app-card>
    </section>

    <section style="display:grid; grid-template-columns: 1.2fr .8fr; gap:.75rem">
      <app-card title="Recent Performance">
        <app-chart-placeholder title="Folio Performance" subtitle="Last 30 days"></app-chart-placeholder>
      </app-card>

      <app-card title="Your Folios">
        <app-table [data]="folios" [columns]="folioCols"></app-table>
        <div card-footer>
          <a routerLink="/analyst/folios" class="text-muted">View all folios →</a>
        </div>
      </app-card>
    </section>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystDashboardComponent {
  private readonly analytics = inject(AnalyticsService);
  private readonly foliosApi = inject(FolioService);

  summary: { folios: number; analysts: number; subscribers: number } | null = null;
  folios: Folio[] = [];
  folioCols = [
    { key: 'title', header: 'Title' },
    { key: 'visibility', header: 'Visibility' },
    { key: 'updatedAt', header: 'Updated' },
  ];

  ngOnInit(): void {
    this.analytics.getPlatformSummary().subscribe((s) => (this.summary = s));
    this.foliosApi.list({ page: 1, pageSize: 5 }).subscribe((f) => (this.folios = f));
  }
}
