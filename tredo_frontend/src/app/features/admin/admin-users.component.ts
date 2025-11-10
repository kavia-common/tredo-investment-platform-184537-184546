import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, TableComponent, ButtonComponent, ModalComponent } from '../../shared';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core';

/**
 * PUBLIC_INTERFACE
 * AdminUsersComponent - Lists users and provides simple actions (placeholders).
 */
@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule, CardComponent, TableComponent, ButtonComponent, ModalComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Users</h2>
      <span class="text-muted">Manage accounts</span>
    </header>

    <app-card>
      <ng-template #actionsTpl let-row>
        <app-button variant="ghost" (clicked)="openUser(row)">View</app-button>
      </ng-template>

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
    </app-card>

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

  private load() {
    this.admin.listUsers().subscribe((rows) => {
      this.users = rows;
      this.sort();
    });
  }

  private sort() {
    if (!this.sortKey) return;
    const k = this.sortKey as keyof User;
    this.users = [...this.users].sort((a, b) => String(a[k]).localeCompare(String(b[k])));
  }
}
