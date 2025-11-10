import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CardComponent, ButtonComponent } from '../../shared';
import { AdminService } from '../../core/services/admin.service';

/**
 * PUBLIC_INTERFACE
 * AdminSettingsComponent - Allows platform operators to configure simple flags.
 */
@Component({
  standalone: true,
  selector: 'app-admin-settings',
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>Settings</h2>
      <span class="text-muted">Platform configuration</span>
    </header>

    <app-card>
      <form [formGroup]="form" (ngSubmit)="save()" style="display:grid; gap:.75rem">
        <label class="field">
          <span>Allow Public Explore</span>
          <input type="checkbox" formControlName="allowPublicExplore"/>
        </label>

        <label class="field">
          <span>Require Email Verification</span>
          <input type="checkbox" formControlName="requireEmailVerification"/>
        </label>

        <label class="field">
          <span>Maintenance Mode</span>
          <input type="checkbox" formControlName="maintenanceMode"/>
        </label>

        <div style="display:flex; gap:.5rem; justify-content:flex-end">
          <app-button variant="ghost" (clicked)="reload()">Reset</app-button>
          <app-button variant="primary" [disabled]="loading">{{ loading ? 'Saving...' : 'Save settings' }}</app-button>
        </div>
      </form>
    </app-card>

    <div *ngIf="message" class="notice">{{ message }}</div>
    <div *ngIf="error" class="alert">{{ error }}</div>
  `,
  styles: [`
    .field { display:flex; align-items:center; justify-content:space-between; padding:.5rem .75rem; border: 1px solid var(--ocean-border); border-radius: var(--radius-md); background: #fff; }
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
export class AdminSettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(AdminService);

  loading = false;
  message: string | null = null;
  error: string | null = null;

  form = this.fb.group({
    allowPublicExplore: [true],
    requireEmailVerification: [true],
    maintenanceMode: [false],
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.admin.getSettings().subscribe((s) => {
      this.form.patchValue({
        allowPublicExplore: !!s['allowPublicExplore'],
        requireEmailVerification: !!s['requireEmailVerification'],
        maintenanceMode: !!s['maintenanceMode'],
      });
    });
  }

  save(): void {
    this.message = null; this.error = null; this.loading = true;
    const payload = this.form.getRawValue() as Record<string, any>;
    this.admin.updateSettings(payload).subscribe({
      next: () => { this.message = 'Settings saved.'; },
      error: (err) => { this.error = err?.error?.message || 'Unable to save settings.'; this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }
}
