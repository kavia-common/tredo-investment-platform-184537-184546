import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared';
import { BaseApiService } from '../../core/services/api.service';
import { getFrontendUrl } from '../../shared/utils/env';

/**
 * VerifyEmailComponent - Informs user to verify email and offers resend link.
 */
@Component({
  standalone: true,
  selector: 'app-verify-email',
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <header style="margin-bottom:.75rem">
      <h2>Verify your email</h2>
      <p class="text-muted">We sent a verification link to your inbox. Click the link to activate your account.</p>
    </header>

    <div class="panel">
      <div class="row">
        <span class="text-muted">Didn't get the email?</span>
        <app-button variant="ghost" (clicked)="resend()" [disabled]="loading">
          {{ loading ? 'Sending...' : 'Resend verification email' }}
        </app-button>
      </div>
      <small class="text-muted">Check spam folder too. The link will redirect to: {{ frontendUrl }}/login</small>
    </div>

    <footer style="margin-top:1rem" class="row">
      <a routerLink="/login">Back to sign in</a>
    </footer>

    <div *ngIf="message" class="notice">{{ message }}</div>
    <div *ngIf="error" class="alert">{{ error }}</div>
  `,
  styles: [`
    .panel { padding: .75rem; border: 1px solid var(--ocean-border); border-radius: var(--radius-md); background: #fff; }
    .row { display:flex; gap:.5rem; align-items:center; }
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
export class VerifyEmailComponent {
  private readonly api = inject(BaseApiService);

  loading = false;
  message: string | null = null;
  error: string | null = null;
  frontendUrl = getFrontendUrl() || '';

  resend(): void {
    this.message = null; this.error = null; this.loading = true;
    if (this.api.mock) {
      import('rxjs').then(rx => {
        rx.timer(400).subscribe(() => {
          this.loading = false;
          this.message = 'Verification email sent (mock). Please check your inbox.';
        });
      });
      return;
    }
    this.api.post<{ ok: boolean; message?: string }>('/auth/verify/resend', {})
      .subscribe({
        next: () => { this.message = 'Verification email sent. Please check your inbox.'; },
        error: (err) => { this.error = err?.error?.message || 'Unable to send verification email.'; this.loading = false; },
        complete: () => { this.loading = false; }
      });
  }
}
