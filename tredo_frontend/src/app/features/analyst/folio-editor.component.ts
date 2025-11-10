import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardComponent, ButtonComponent } from '../../shared';
import { FolioService } from '../../core/services/folio.service';
import { Folio, FolioVisibility } from '../../core';

/**
 * PUBLIC_INTERFACE
 * FolioEditorComponent - Create or edit a folio (basic fields; extend later with pricing/trades).
 */
@Component({
  standalone: true,
  selector: 'app-folio-editor',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent],
  template: `
    <header style="display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem">
      <h2>{{ isNew ? 'Create Folio' : 'Edit Folio' }}</h2>
      <span class="text-muted">{{ isNew ? 'New portfolio of recommendations' : (folio?.title || '') }}</span>
      <span style="flex:1"></span>
      <a routerLink="/analyst/folios" class="text-muted">Back to list</a>
    </header>

    <app-card>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:grid; gap:.75rem">
        <label class="field">
          <span>Title</span>
          <input type="text" formControlName="title" [class.invalid]="invalid('title')" />
          <small class="error" *ngIf="invalid('title')">Title is required.</small>
        </label>

        <label class="field">
          <span>Slug</span>
          <input type="text" formControlName="slug" [class.invalid]="invalid('slug')" />
          <small class="error" *ngIf="invalid('slug')">Slug is required (lowercase letters, digits, hyphen).</small>
        </label>

        <label class="field">
          <span>Description</span>
          <textarea rows="5" formControlName="description"></textarea>
        </label>

        <label class="field">
          <span>Visibility</span>
          <select formControlName="visibility">
            <option value="public">Public</option>
            <option value="subscribers">Subscribers only</option>
            <option value="private">Private</option>
          </select>
        </label>

        <div style="display:flex; gap:.5rem; justify-content:flex-end; margin-top:.5rem">
          <app-button variant="ghost" [disabled]="loading" (clicked)="cancel()">Cancel</app-button>
          <app-button variant="primary" [disabled]="form.invalid || loading">{{ loading ? 'Saving...' : 'Save' }}</app-button>
        </div>
      </form>
    </app-card>

    <div *ngIf="message" class="notice">{{ message }}</div>
    <div *ngIf="error" class="alert">{{ error }}</div>
  `,
  styles: [`
    .field { display:flex; flex-direction:column; gap:.25rem }
    input, textarea, select {
      padding:.625rem .75rem;
      border:1px solid var(--ocean-border);
      border-radius: var(--radius-md);
      background: #fff;
      outline: none;
    }
    input.invalid { border-color: var(--ocean-error); }
    .error { color: var(--ocean-error); }
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
export class FolioEditorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly foliosApi = inject(FolioService);

  folio: Folio | null = null;
  isNew = true;
  loading = false;
  message: string | null = null;
  error: string | null = null;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    description: [''],
    visibility: ['public' as FolioVisibility, [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNew = !id;
    if (id) {
      this.loading = true;
      this.foliosApi.getById(id).subscribe({
        next: (f) => { this.folio = f; this.form.patchValue({
          title: f.title, slug: f.slug, description: f.description || '', visibility: f.visibility
        }); },
        error: () => { this.error = 'Unable to load folio.'; },
        complete: () => { this.loading = false; }
      });
    }
  }

  invalid(ctrl: 'title'|'slug'): boolean {
    const c = this.form.controls[ctrl];
    return !!(c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    this.error = null; this.message = null;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const payload = this.form.getRawValue();

    // Mock mode: we only simulate local save and navigate back.
    if ((this.foliosApi as any)['api']?.mock) {
      // Simulate async and navigate
      import('rxjs').then(rx => {
        rx.timer(350).subscribe(() => {
          this.loading = false;
          this.message = 'Saved (mock).';
          this.router.navigateByUrl('/analyst/folios');
        });
      });
      return;
    }

    // In real mode, POST for new or PUT/PATCH for edit (paths are placeholders until backend wiring is done).
    // Avoid generics on untyped 'any' calls to satisfy strict TS rule TS2347.
    const call$ = this.isNew
      ? (this.foliosApi as any).api.post('/folios', payload) as import('rxjs').Observable<Folio>
      : (this.foliosApi as any).api.put(`/folios/${this.folio?.id}`, payload) as import('rxjs').Observable<Folio>;

    call$.subscribe({
      next: () => this.router.navigateByUrl('/analyst/folios'),
      error: (err: any) => { this.error = err?.error?.message || 'Unable to save folio.'; this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/analyst/folios');
  }
}
