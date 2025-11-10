import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, TableComponent, ButtonComponent, ModalComponent } from '../../shared';
import { AdminService } from '../../core/services/admin.service';

/**
 * PUBLIC_INTERFACE
 * AdminApprovalsComponent - Displays and manages analyst approvals queue.
 */
@Component({
  standalone: true,
  selector: 'app-admin-approvals',
  imports: [CommonModule, CardComponent, TableComponent, ButtonComponent, ModalComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Approvals Queue</h2>
      <span class="text-muted">Analyst applications</span>
    </header>

    <app-card>
      <ng-template #actionsTpl let-row>
        <app-button variant="ghost" (clicked)="view(row)">View</app-button>
        <app-button variant="primary" (clicked)="approve(row)" [disabled]="loadingId===row.id">Approve</app-button>
        <app-button variant="ghost" (clicked)="reject(row)" [disabled]="loadingId===row.id">Reject</app-button>
      </ng-template>

      <app-table
        [data]="rows"
        [columns]="[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'licenseId', header: 'SEBI License' },
          { key: 'submittedAt', header: 'Submitted' },
          { key: 'actions', header: 'Actions', type: 'template', template: actionsTpl }
        ]">
      </app-table>

      <div card-footer>
        <span class="text-muted">{{ rows?.length || 0 }} pending</span>
      </div>
    </app-card>

    <app-modal [open]="modalOpen" title="Application" (close)="modalOpen=false">
      <div *ngIf="selected">
        <div style="display:grid; gap:.25rem">
          <div><strong>ID:</strong> {{ selected.id }}</div>
          <div><strong>Name:</strong> {{ selected.name }}</div>
          <div><strong>Email:</strong> {{ selected.email }}</div>
          <div><strong>License:</strong> {{ selected.licenseId }}</div>
          <div><strong>Submitted:</strong> {{ selected.submittedAt }}</div>
        </div>
      </div>
      <div modal-actions>
        <app-button variant="ghost" (clicked)="modalOpen=false">Close</app-button>
      </div>
    </app-modal>

    <div *ngIf="message" class="notice">{{ message }}</div>
    <div *ngIf="error" class="alert">{{ error }}</div>
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
export class AdminApprovalsComponent {
  private readonly admin = inject(AdminService);

  rows: Array<{ id: string; name: string; email: string; licenseId: string; submittedAt: string }> = [];
  loadingId: string | null = null;

  modalOpen = false;
  selected: { id: string; name: string; email: string; licenseId: string; submittedAt: string } | null = null;

  message: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  view(row: any) {
    this.selected = row;
    this.modalOpen = true;
  }

  approve(row: any) {
    this.message = null; this.error = null; this.loadingId = row.id;
    this.admin.approve(row.id).subscribe({
      next: () => { this.message = 'Approved successfully.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || 'Unable to approve.'; this.loadingId = null; },
      complete: () => { this.loadingId = null; },
    });
  }

  reject(row: any) {
    this.message = null; this.error = null; this.loadingId = row.id;
    this.admin.reject(row.id).subscribe({
      next: () => { this.message = 'Rejected successfully.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || 'Unable to reject.'; this.loadingId = null; },
      complete: () => { this.loadingId = null; },
    });
  }

  private load() {
    this.admin.approvals().subscribe((r) => (this.rows = r));
  }
}
