import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent, TableComponent, ErrorBannerComponent } from '../../shared';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription } from '../../core';

/**
 * PUBLIC_INTERFACE
 * BillingComponent - Shows subscription billing info and allows cancellation.
 */
@Component({
  standalone: true,
  selector: 'app-billing',
  imports: [CommonModule, CardComponent, ButtonComponent, TableComponent, ErrorBannerComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Billing</h2>
      <span class="text-muted">Manage your plans</span>
    </header>

    <app-card title="Active Plans">
      <ng-template #actionsTpl let-row>
        <app-button variant="ghost" (clicked)="cancel(row)" [disabled]="row.status !== 'active'">Cancel at period end</app-button>
      </ng-template>

      <app-table
        [data]="rows"
        [columns]="[
          { key: 'folioTitle', header: 'Folio' },
          { key: 'status', header: 'Status' },
          { key: 'currentPeriodEnd', header: 'Renews' },
          { key: 'actions', header: 'Actions', type: 'template', template: actionsTpl }
        ]">
      </app-table>
    </app-card>

    <div *ngIf="message" class="notice">{{ message }}</div>
    <app-error-banner [message]="error"></app-error-banner>
  `,
  styles: [`
    .alert {
      margin-top: .75rem;
      padding: .5rem .75rem;
      background: color-mix(in oklab, var(--ocean-error) 10%, #fff);
      border: 1px solid color-mix(in oklab, var(--ocean-error) 30%, #fff);
      border-radius: var(--radius-md);
      color: #7f1d1d;
    }
    .notice {
      margin-top: .75rem;
      padding: .5rem .75rem;
      background: color-mix(in oklab, var(--ocean-success) 12%, #fff);
      border: 1px solid color-mix(in oklab, var(--ocean-success) 30%, #fff);
      border-radius: var(--radius-md);
      color: #065f46;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingComponent {
  private readonly subsApi = inject(SubscriptionService);

  rows: Array<Subscription & { folioTitle?: string }> = [];
  message: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  cancel(row: Subscription): void {
    this.message = null; this.error = null;
    this.subsApi.cancel(row.id).subscribe({
      next: () => {
        this.message = 'Subscription will be cancelled at period end.';
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to cancel subscription.';
      },
    });
  }

  private load(): void {
    this.subsApi.mySubscriptions().subscribe((rows) => {
      this.rows = rows.map(r => ({ ...r, folioTitle: r.folioId }));
    });
  }
}
