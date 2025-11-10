import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent, TableComponent } from '../../shared';
import { SubscriptionService } from '../../core/services/subscription.service';
import { FolioService } from '../../core/services/folio.service';
import { Subscription, Folio } from '../../core';
import { RouterLink } from '@angular/router';

/**
 * PUBLIC_INTERFACE
 * MySubscriptionsComponent - Lists and manages the user's subscriptions.
 */
@Component({
  standalone: true,
  selector: 'app-my-subscriptions',
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, TableComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>My Subscriptions</h2>
      <span class="text-muted">Manage your active plans</span>
      <span style="flex:1"></span>
      <a routerLink="/explore" class="text-muted">Find more folios →</a>
    </header>

    <app-card>
      <ng-template #folioTpl let-row>
        <div style="display:flex; align-items:center; gap:.25rem;">
          <span style="font-weight:600">{{ row.folioTitle || 'Folio' }}</span>
          <span class="text-muted">/ {{ row.folioId }}</span>
        </div>
      </ng-template>

      <app-table
        [data]="rows"
        [columns]="[
          { key: 'folioTitle', header: 'Folio', type: 'template', template: folioTpl },
          { key: 'status', header: 'Status' },
          { key: 'price', header: 'Price (₹)' },
          { key: 'currentPeriodEnd', header: 'Renews' }
        ]"
        (sort)="onSort($event)">
      </app-table>

      <div card-footer style="display:flex; gap:.5rem; align-items:center; justify-content:flex-end">
        <app-button variant="ghost" (clicked)="refresh()">Refresh</app-button>
      </div>
    </app-card>

    <section style="margin-top:.75rem; display:grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap:.75rem">
      <app-card title="Tips">
        <ul style="padding-left:1rem; line-height:1.8">
          <li>Subscriptions renew automatically until cancelled.</li>
          <li>Prices shown are per period and inclusive of taxes when applicable.</li>
          <li>Contact support if you have billing questions.</li>
        </ul>
      </app-card>
    </section>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MySubscriptionsComponent {
  private readonly subsApi = inject(SubscriptionService);
  private readonly foliosApi = inject(FolioService);

  rows: Array<Subscription & { folio?: Folio | null; folioTitle?: string; price?: number }> = [];
  sortKey: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  refresh(): void {
    this.load();
  }

  onSort(key: string) {
    this.sortKey = String(key);
    this.sort();
  }

  private load(): void {
    this.subsApi.mySubscriptions().subscribe((subs) => {
      this.rows = subs.map(s => ({
        ...s,
        price: (s.unitAmount || 0) / 100,
      }));
      this.rows.forEach((r, i) => {
        this.foliosApi.getById(r.folioId).subscribe((f) => {
          this.rows[i].folio = f;
          this.rows[i].folioTitle = f.title;
        }, () => void 0);
      });
      this.sort();
    });
  }

  private sort(): void {
    if (!this.sortKey) return;
    const k = this.sortKey as keyof (Subscription & { price?: number; folioTitle?: string });
    this.rows = [...this.rows].sort((a, b) => String((a as any)[k]).localeCompare(String((b as any)[k])));
  }
}
