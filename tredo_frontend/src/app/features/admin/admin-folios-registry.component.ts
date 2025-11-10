import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, TableComponent } from '../../shared';
import { AdminService } from '../../core/services/admin.service';

/**
 * PUBLIC_INTERFACE
 * AdminFoliosRegistryComponent - Lists all folios in the platform.
 */
@Component({
  standalone: true,
  selector: 'app-admin-folios-registry',
  imports: [CommonModule, CardComponent, TableComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Folios Registry</h2>
      <span class="text-muted">All analyst portfolios</span>
    </header>

    <app-card>
      <app-table
        [data]="rows"
        [columns]="[
          { key: 'title', header: 'Title' },
          { key: 'analystId', header: 'Analyst' },
          { key: 'visibility', header: 'Visibility' },
          { key: 'updatedAt', header: 'Updated' }
        ]"
        (sort)="onSort($event)">
      </app-table>

      <div card-footer>
        <span class="text-muted">Total {{ rows?.length || 0 }} folios</span>
      </div>
    </app-card>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFoliosRegistryComponent {
  private readonly admin = inject(AdminService);

  rows: Array<{ id: string; title: string; analystId: string; visibility: string; updatedAt: string }> = [];
  sortKey: string | null = null;

  ngOnInit(): void {
    this.admin.foliosRegistry().subscribe((r) => {
      this.rows = r;
      this.sort();
    });
  }

  onSort(key: string) {
    this.sortKey = key;
    this.sort();
  }

  private sort() {
    if (!this.sortKey) return;
    const k = this.sortKey as keyof (typeof this.rows)[number];
    this.rows = [...this.rows].sort((a, b) => String(a[k]).localeCompare(String(b[k])));
  }
}
