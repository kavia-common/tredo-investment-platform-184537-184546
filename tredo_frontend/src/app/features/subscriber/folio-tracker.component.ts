import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ChartPlaceholderComponent, TableComponent } from '../../shared';
import { FolioService } from '../../core/services/folio.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Folio } from '../../core';

/**
 * PUBLIC_INTERFACE
 * FolioTrackerComponent - Displays subscribed folios and placeholder performance charts.
 */
@Component({
  standalone: true,
  selector: 'app-folio-tracker',
  imports: [CommonModule, CardComponent, ChartPlaceholderComponent, TableComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Folio Tracker</h2>
      <span class="text-muted">Follow performance of your subscriptions</span>
    </header>

    <section style="display:grid; grid-template-columns: 1fr; gap:.75rem">
      <app-card title="Subscribed Folios">
        <app-table [data]="folios" [columns]="cols"></app-table>
      </app-card>

      <app-card title="Performance">
        <app-chart-placeholder title="Aggregate Performance" subtitle="Last 90 days"></app-chart-placeholder>
      </app-card>
    </section>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolioTrackerComponent {
  private readonly subsApi = inject(SubscriptionService);
  private readonly foliosApi = inject(FolioService);

  folios: Folio[] = [];
  cols = [
    { key: 'title', header: 'Title' },
    { key: 'visibility', header: 'Visibility' },
    { key: 'updatedAt', header: 'Updated' },
  ];

  ngOnInit(): void {
    // Pull subscriptions then hydrate folio details
    this.subsApi.mySubscriptions().subscribe((subs) => {
      const ids = Array.from(new Set(subs.map(s => s.folioId)));
      // Fetch each folio quickly (no batch endpoint available yet)
      this.folios = [];
      ids.forEach(id => {
        this.foliosApi.getById(id).subscribe(f => {
          this.folios = [...this.folios, f];
        }, () => void 0);
      });
    });
  }
}
