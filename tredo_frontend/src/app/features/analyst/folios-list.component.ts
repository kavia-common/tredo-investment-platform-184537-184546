import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent, ButtonComponent, TableComponent, TruncatePipe } from '../../shared';
import { FolioService } from '../../core/services/folio.service';
import { Folio } from '../../core';

/**
 * PUBLIC_INTERFACE
 * FoliosListComponent - Lists analyst's folios with quick actions.
 */
@Component({
  standalone: true,
  selector: 'app-folios-list',
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, TableComponent, TruncatePipe],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Your Folios</h2>
      <span class="text-muted">Manage and publish</span>
      <span style="flex:1"></span>
      <a routerLink="/analyst/folios/new"><app-button variant="primary">New Folio</app-button></a>
    </header>

    <app-card>
      <ng-template #titleTpl let-row>
        <div style="display:flex; align-items:center; gap:.5rem;">
          <a [routerLink]="['/analyst/folios', row.id]" style="text-decoration:none; color:inherit; font-weight:600">{{ row.title }}</a>
          <span class="text-muted">/ {{ row.slug }}</span>
        </div>
        <div class="text-muted">{{ row.description | truncate:120:false }}</div>
      </ng-template>

      <app-table
        [data]="folios"
        [columns]="[
          { key: 'title', header: 'Folio', type: 'template', template: titleTpl },
          { key: 'visibility', header: 'Visibility' },
          { key: 'updatedAt', header: 'Updated' }
        ]"
        (sort)="onSort($event)">
      </app-table>

      <div card-footer>
        <span class="text-muted">Showing {{ (folios && folios.length) ? folios.length : 0 }} entries</span>
      </div>
    </app-card>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoliosListComponent {
  private readonly foliosApi = inject(FolioService);

  folios: Folio[] = [];
  sortKey: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  onSort(key: string) {
    this.sortKey = String(key);
    this.sort();
  }

  private load() {
    this.foliosApi.list({ page: 1, pageSize: 25 }).subscribe((data) => {
      this.folios = data;
      this.sort();
    });
  }

  private sort() {
    if (!this.sortKey) return;
    const key = this.sortKey as keyof Folio;
    this.folios = [...this.folios].sort((a, b) => String(a[key]).localeCompare(String(b[key])));
  }
}
