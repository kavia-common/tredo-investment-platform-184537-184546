import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent, ChartPlaceholderComponent, ButtonComponent, TableComponent, EmptyStateComponent } from '../../shared';
import { SubscriptionService } from '../../core/services/subscription.service';
import { FolioService } from '../../core/services/folio.service';
import { Subscription, Folio } from '../../core';

/**
 * PUBLIC_INTERFACE
 * SubscriberDashboardComponent - Overview of active subscriptions and quick links.
 */
@Component({
  standalone: true,
  selector: 'app-subscriber-dashboard',
  imports: [CommonModule, RouterLink, CardComponent, ChartPlaceholderComponent, ButtonComponent, TableComponent, EmptyStateComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Subscriber Dashboard</h2>
      <span class="text-muted">Overview</span>
      <span style="flex:1"></span>
      <a routerLink="/explore"><app-button variant="primary">Explore Folios</app-button></a>
    </header>

    <section style="display:grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap:.75rem; margin-bottom:.75rem">
      <app-card>
        <div>
          <div class="text-muted">Active Subscriptions</div>
          <div style="font-size:1.5rem; font-weight:700">{{ activeCount }}</div>
        </div>
      </app-card>
      <app-card>
        <div>
          <div class="text-muted">Billing</div>
          <div style="font-size:1.5rem; font-weight:700">Managed</div>
        </div>
      </app-card>
      <app-card>
        <div>
          <div class="text-muted">Next Renewal</div>
          <div style="font-size:1.1rem; font-weight:600">{{ nextRenewal || '—' }}</div>
        </div>
      </app-card>
    </section>

    <section style="display:grid; grid-template-columns: 1.2fr .8fr; gap:.75rem">
      <app-card title="Your Subscriptions">
        <ng-container *ngIf="(subs && subs.length) > 0; else noSubs">
          <app-table [data]="subs" [columns]="subCols"></app-table>
          <div card-footer>
            <a routerLink="/subscriber/my-subscriptions" class="text-muted">Manage subscriptions →</a>
          </div>
        </ng-container>
        <ng-template #noSubs>
          <app-empty-state
            title="No active subscriptions"
            description="Explore analyst folios and subscribe to track performance in your dashboard."
            [actionLabel]="'Explore Folios'"
            (action)="goExplore()">
          </app-empty-state>
        </ng-template>
      </app-card>

      <app-card title="Portfolio Performance">
        <app-chart-placeholder title="Aggregate" subtitle="Last 30 days"></app-chart-placeholder>
      </app-card>
    </section>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriberDashboardComponent {
  private readonly subsApi = inject(SubscriptionService);
  private readonly foliosApi = inject(FolioService);

  subs: (Subscription & { folio?: Folio | null })[] = [];
  subCols = [
    { key: 'folioTitle', header: 'Folio' },
    { key: 'status', header: 'Status' },
    { key: 'unitAmount', header: 'Price (₹)' },
    { key: 'currentPeriodEnd', header: 'Renews' },
  ];

  activeCount = 0;
  nextRenewal: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  goExplore(): void {
    try {
      const g = globalThis as unknown as { location?: { href: string } };
      if (g && g.location) g.location.href = '/explore';
    } catch { /* no-op */ }
  }

  private load(): void {
    this.subsApi.mySubscriptions().subscribe((rows) => {
      this.subs = rows.map((r) => ({ ...r, folio: null })) as any;
      this.activeCount = rows.filter(r => r.status === 'active').length;
      const next = rows
        .map(r => new Date(r.currentPeriodEnd).getTime())
        .sort((a,b) => a - b)[0];
      this.nextRenewal = next ? new Date(next).toLocaleDateString() : null;

      // Best-effort: hydrate folio names in mock/real
      this.subs.forEach((s, i) => {
        this.foliosApi.getById(s.folioId).subscribe(f => {
          (this.subs[i] as any).folioTitle = f.title;
          (this.subs[i] as any).unitAmount = (s.unitAmount || 0) / 100;
        }, () => {
          (this.subs[i] as any).folioTitle = '—';
          (this.subs[i] as any).unitAmount = (s.unitAmount || 0) / 100;
        });
      });
    });
  }
}
