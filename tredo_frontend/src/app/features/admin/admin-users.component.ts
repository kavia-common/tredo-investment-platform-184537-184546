import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, TableComponent, ButtonComponent, ModalComponent, EmptyStateComponent, ErrorBannerComponent } from '../../shared';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core';

/**
 * PUBLIC_INTERFACE
 * AdminUsersComponent - Lists users and provides simple actions (placeholders).
 */
@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule, CardComponent, TableComponent, ButtonComponent, ModalComponent, EmptyStateComponent, ErrorBannerComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Users</h2>
      <span class="text-muted">Manage accounts</span>
    </header>

    <app-card>
      <ng-template #actionsTpl let-row>
        <app-button variant="ghost" (clicked)="openUser(row)">View</app-button>
      </ng-template>

      <ng-container *ngIf="(users && users.length) > 0; else emptyBlock">
        <app-table
          [data]="users"
          [columns]="[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Role' },
            { key: 'actions', header: 'Actions', type: 'template', template: actionsTpl }
          ]"
          (sort)="onSort($event)">
        </app-table>

        <div card-footer>
          <span class="text-muted">Total {{ users?.length || 0 }} users</span>
        </div>
      </ng-container>

      <ng-template #emptyBlock>
        <app-empty-state
          title="No users yet"
          description="Once users sign up, they will appear here. You can invite users or check back later."
          [actionLabel]="'Refresh'"
          actionVariant="ghost"
          (action)="load()">
        </app-empty-state>
      </ng-template>
    </app-card>

    <app-error-banner [message]="error"></app-error-banner>

    <app-modal [open]="modalOpen" title="User Details" (close)="modalOpen=false">
      <div *ngIf="selectedUser; else none">
        <div style="display:grid; gap:.25rem">
          <div><strong>ID:</strong> {{ selectedUser.id }}</div>
          <div><strong>Name:</strong> {{ selectedUser.name }}</div>
          <div><strong>Email:</strong> {{ selectedUser.email }}</div>
          <div><strong>Role:</strong> {{ selectedUser.role }}</div>
        </div>
      </div>
      <ng-template #none>
        <div class="text-muted">No user selected.</div>
      </ng-template>
      <div modal-actions>
        <app-button variant="ghost" (clicked)="modalOpen=false">Close</app-button>
      </div>
    </app-modal>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent {
  private readonly admin = inject(AdminService);

  users: User[] = [];
  sortKey: string | null = null;

  modalOpen = false;
  selectedUser: User | null = null;

  ngOnInit(): void {
    this.load();
  }

  onSort(key: string) {
    this.sortKey = key;
    this.sort();
  }

  openUser(row: User) {
    this.selectedUser = row;
    this.modalOpen = true;
  }

  error: string | null = null;

  load() {
    this.admin.listUsers().subscribe({
      next: (rows) => {
        this.users = rows;
        this.sort();
      },
      error: (e) => {
        this.error = e?.error?.message || 'Unable to load users.';
      }
    });
  }

  private sort() {
    if (!this.sortKey) return;
    const k = this.sortKey as keyof User;
    this.users = [...this.users].sort((a, b) => String(a[k]).localeCompare(String(b[k])));
  }
}
