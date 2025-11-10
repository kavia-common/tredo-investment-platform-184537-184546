import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * ButtonComponent - themed button with variants and disabled state.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class.primary]="variant==='primary'"
      [class.secondary]="variant==='secondary'"
      [class.ghost]="variant==='ghost'"
      [disabled]="disabled"
      type="button"
      (click)="clicked.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      cursor: pointer;
      padding: .5rem .75rem;
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      transition: background .2s ease, border-color .2s ease;
      color: var(--ocean-text);
      background: var(--ocean-surface);
    }
    .btn.primary {
      background: var(--ocean-primary);
      color: #fff;
    }
    .btn.secondary {
      background: var(--ocean-secondary);
      color: #111827;
    }
    .btn.ghost {
      background: transparent;
      border-color: var(--ocean-border);
    }
    .btn:disabled { opacity: .6; cursor: not-allowed; }
  `],
})
export class ButtonComponent {
  // PUBLIC_INTERFACE
  /** Variant of button: primary | secondary | ghost */
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  // PUBLIC_INTERFACE
  /** Disabled state */
  @Input() disabled = false;
  // PUBLIC_INTERFACE
  /** Emits click event */
  @Output() clicked = new EventEmitter<unknown>();
}
