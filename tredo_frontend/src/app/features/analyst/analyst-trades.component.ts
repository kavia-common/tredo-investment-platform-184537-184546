import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent, TableComponent } from '../../shared';
import { FolioService } from '../../core/services/folio.service';
import { Trade } from '../../core/models/trade.model';
import { BaseApiService } from '../../core/services/api.service';

/**
 * PUBLIC_INTERFACE
 * AnalystTradesComponent - Displays recent trades across the analyst's folios.
 */
@Component({
  standalone: true,
  selector: 'app-analyst-trades',
  imports: [CommonModule, CardComponent, ButtonComponent, TableComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Trades</h2>
      <span class="text-muted">Recent activity</span>
      <span style="flex:1"></span>
      <app-button variant="primary" [disabled]="true">New Trade (coming soon)</app-button>
    </header>

    <app-card title="Recent Trades">
      <app-table [data]="trades" [columns]="columns"></app-table>
      <div card-footer>
        <span class="text-muted">Total {{ (trades && trades.length) ? trades.length : 0 }} trades</span>
      </div>
    </app-card>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystTradesComponent {
  private readonly api = inject(BaseApiService);
  private readonly foliosApi = inject(FolioService);

  trades: Trade[] = [];
  columns = [
    { key: 'symbol', header: 'Symbol' },
    { key: 'type', header: 'Type' },
    { key: 'quantity', header: 'Qty' },
    { key: 'price', header: 'Price' },
    { key: 'status', header: 'Status' },
    { key: 'executedAt', header: 'Executed' },
  ];

  ngOnInit(): void {
    if (this.api.mock) {
      // Light mock dataset
      const now = new Date().toISOString();
      this.trades = [
        { id: 't1', folioId: 'f1', symbol: 'INFY', type: 'buy', quantity: 10, price: 1500, status: 'open', executedAt: now },
        { id: 't2', folioId: 'f1', symbol: 'TCS', type: 'sell', quantity: 5, price: 3600, status: 'closed', executedAt: now, closedAt: now },
      ];
    } else {
      // Placeholder endpoint until backend spec is added
      this.api.get<Trade[]>('/trades/my').subscribe((rows) => (this.trades = rows));
    }
  }
}
