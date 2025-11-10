import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AutofocusDirective, ButtonComponent, ErrorBannerComponent } from '../../shared';
import { getFrontendUrl } from '../../shared/utils/env';

/**
 * LoginComponent - Sign-in form with client-side validation and AuthService wiring.
 */
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, AutofocusDirective, ErrorBannerComponent],
  template: `
    <header style="margin-bottom:.75rem">
      <h2 style="margin-bottom:.25rem">Welcome back</h2>
      <p class="text-muted">Sign in to your Tredo account</p>
    </header>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <div style="display:grid; gap:.75rem">
        <label class="field">
          <span>Email</span>
          <input
                 [appAutofocus]="true"
                 type="email"
                 inputmode="email"
                 autocomplete="email"
                 formControlName="email"
                 [class.invalid]="emailInvalid"/>
          <small class="error" *ngIf="emailInvalid">Enter a valid email.</small>
        </label>

        <label class="field">
          <span>Password</span>
          <input type="password"
                 autocomplete="current-password"
                 formControlName="password"
                 [class.invalid]="passwordInvalid"/>
          <small class="error" *ngIf="passwordInvalid">Password is required (min 6 chars).</small>
        </label>

        <div class="row">
          <label class="checkbox">
            <input type="checkbox" formControlName="remember" />
            <span>Remember me</span>
          </label>

          <a class="muted" href="#" (click)="$event.preventDefault()">Forgot password?</a>
        </div>

        <app-button [disabled]="form.invalid || loading" variant="primary">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </app-button>
      </div>
    </form>

    <footer style="margin-top:1rem" class="row">
      <span class="text-muted">New to Tredo?</span>
      <a routerLink="/register-subscriber">Create a subscriber account</a>
      <span class="text-muted">or</span>
      <a routerLink="/register-analyst">Apply as an analyst</a>
    </footer>

    <app-error-banner [message]="error"></app-error-banner>
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
    input:focus { border-color: color-mix(in oklab, var(--ocean-primary) 50%, var(--ocean-border)); }
    input.invalid { border-color: var(--ocean-error); }
    .error { color: var(--ocean-error); }
    .row { display:flex; gap:.5rem; align-items:center; justify-content: space-between; }
    .checkbox { display:flex; align-items:center; gap:.5rem; }
    .muted { color: var(--ocean-muted); text-decoration:none; }
    .alert {
      margin-top: .75rem;
      padding: .5rem .75rem;
      background: color-mix(in oklab, var(--ocean-error) 10%, #fff);
      border: 1px solid color-mix(in oklab, var(--ocean-error) 30%, #fff);
      border-radius: var(--radius-md);
      color: #7f1d1d;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  get emailInvalid(): boolean {
    const c = this.form.controls.email;
    return !!(c.invalid && (c.dirty || c.touched));
    }

  get passwordInvalid(): boolean {
    const c = this.form.controls.password;
    return !!(c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.loading = true;
    this.auth.login(String(email), String(password)).subscribe({
      next: () => {
        // Post-login, try to fetch the user and route based on role if available
        this.auth.me().subscribe({
          next: (user) => {
            const url = this.getPostLoginUrl(user?.role);
            this.router.navigateByUrl(url).catch(() => {
              // As an SSR-safe fallback, compute absolute URL and set location if needed
              try {
                const front = getFrontendUrl();
                if ((globalThis as any)?.location && front) {
                  (globalThis as any).location.href = front + url;
                }
              } catch { /* ignore */ }
            });
          },
          error: () => this.router.navigateByUrl('/').catch(() => void 0),
        });
      },
      error: (err) => {
        this.error = (err?.error?.message || 'Unable to sign in. Please check your credentials.');
        this.loading = false;
      },
      complete: () => { this.loading = false; },
    });
  }

  private getPostLoginUrl(role?: import('../../core/models/user.model').UserRole): string {
    switch (role) {
      case 'analyst': return '/analyst';
      case 'subscriber': return '/subscriber';
      case 'admin': return '/admin';
      default: return '/';
    }
  }
}
