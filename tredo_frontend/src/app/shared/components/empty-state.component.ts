import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

/**
 * PUBLIC_INTERFACE
 * EmptyStateComponent - Reusable empty state with title, description and optional action.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="empty">
      <div class="icon">🫧</div>
      <h3 class="title">{{ title }}</h3>
      <p class="desc text-muted" *ngIf="description">{{ description }}</p>
      <div class="actions" *ngIf="actionLabel">
        <app-button [variant]="actionVariant" (clicked)="action.emit()">{{ actionLabel }}</app-button>
      </div>
    </section>
  `,
  styles: [`
    .empty {
      background: var(--ocean-surface);
      border: 1px solid var(--ocean-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: 1.25rem;
      display: grid;
      place-items: center;
      gap: .5rem;
      text-align: center;
    }
    .icon { font-size: 2rem; }
    .title { font-weight: 700; }
    .desc { max-width: 48ch; }
    .actions { margin-top: .25rem; }
  `],
})
export class EmptyStateComponent {
  // PUBLIC_INTERFACE
  /** Title for the empty state */
  @Input() title = 'Nothing here yet';
  // PUBLIC_INTERFACE
  /** Description below the title */
  @Input() description = '';
  // PUBLIC_INTERFACE
  /** Label for action button */
  @Input() actionLabel: string | null = null;
  // PUBLIC_INTERFACE
  /** Button variant */
  @Input() actionVariant: 'primary' | 'secondary' | 'ghost' = 'primary';
  // PUBLIC_INTERFACE
  /** Emits when action button is clicked */
  @Output() action = new EventEmitter<void>();
}
