import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent, AutofocusDirective } from '../../shared';
import { BaseApiService } from '../../core/services/api.service';

/**
 * RegisterSubscriberComponent - Subscriber signup with email/password.
 * Uses BaseApiService mock flag for local demo mode.
 */
@Component({
  standalone: true,
  selector: 'app-register-subscriber',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, AutofocusDirective],
  template: `
    <header style="margin-bottom:.75rem">
      <h2 style="margin-bottom:.25rem">Create your subscriber account</h2>
      <p class="text-muted">Join Tredo and follow licensed analysts.</p>
    </header>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div style="display:grid; gap:.75rem">
        <label class="field">
          <span>Name</span>
          <input [appAutofocus]="true" type="text" autocomplete="name" formControlName="name" [class.invalid]="nameInvalid"/>
          <small class="error" *ngIf="nameInvalid">Name is required.</small>
        </label>

        <label class="field">
          <span>Email</span>
          <input type="email" inputmode="email" autocomplete="email" formControlName="email" [class.invalid]="emailInvalid"/>
          <small class="error" *ngIf="emailInvalid">Enter a valid email.</small>
        </label>

        <label class="field">
          <span>Password</span>
          <input type="password" autocomplete="new-password" formControlName="password" [class.invalid]="passwordInvalid"/>
          <small class="error" *ngIf="passwordInvalid">Password must be at least 6 characters.</small>
        </label>

        <label class="checkbox">
          <input type="checkbox" formControlName="accept" />
          <span>I agree to the Terms and Privacy Policy</span>
        </label>
        <small class="error" *ngIf="acceptInvalid">You must accept to continue.</small>

        <app-button [disabled]="form.invalid || loading" variant="primary">
          {{ loading ? 'Creating account...' : 'Create account' }}
        </app-button>
      </div>
    </form>

    <footer style="margin-top:1rem" class="row">
      <span class="text-muted">Already have an account?</span>
      <a routerLink="/login">Sign in</a>
    </footer>

    <div *ngIf="message" class="notice">{{ message }}</div>
    <div *ngIf="error" class="alert">{{ error }}</div>
  `,
  styles: [`
    .field { display:flex; flex-direction:column; gap:.25rem }
    input {
      padding:.625rem .75rem;
      border:1px solid var(--ocean-border);
      border-radius: var(--radius-md);
      background: #fff;
      outline: none;
    }
    input.invalid { border-color: var(--ocean-error); }
    .error { color: var(--ocean-error); }
    .row { display:flex; gap:.5rem; align-items:center; }
    .checkbox { display:flex; align-items:center; gap:.5rem; }
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
export class RegisterSubscriberComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly api = inject(BaseApiService);

  loading = false;
  error: string | null = null;
  message: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    accept: [false, [Validators.requiredTrue]],
  });

  get nameInvalid() { const c = this.form.controls.name; return !!(c.invalid && (c.dirty || c.touched)); }
  get emailInvalid() { const c = this.form.controls.email; return !!(c.invalid && (c.dirty || c.touched)); }
  get passwordInvalid() { const c = this.form.controls.password; return !!(c.invalid && (c.dirty || c.touched)); }
  get acceptInvalid() { const c = this.form.controls.accept; return !!(c.invalid && (c.dirty || c.touched)); }

  onSubmit(): void {
    this.error = null; this.message = null;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, email, password } = this.form.getRawValue();
    this.loading = true;

    if (this.api.mock) {
      // In mock mode, simulate successful registration and direct login to improve UX
      this.auth.login(String(email), String(password)).subscribe({
        next: () => this.router.navigateByUrl('/subscriber'),
        error: () => { this.message = 'Account created. Please sign in.'; },
        complete: () => { this.loading = false; }
      });
      return;
    }

    // Real backend call
    this.api.post<{ ok: boolean; message?: string }>('/auth/register/subscriber', { name, email, password })
      .subscribe({
        next: () => this.router.navigateByUrl('/verify-email'),
        error: (err) => {
          this.error = err?.error?.message || 'Unable to create account. Please try again.';
          this.loading = false;
        },
        complete: () => { this.loading = false; }
      });
  }
}
