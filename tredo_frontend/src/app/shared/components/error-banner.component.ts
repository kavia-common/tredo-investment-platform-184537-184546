import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * ErrorBannerComponent - Styled error banner to display error messages.
 */
@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="alert" role="alert" *ngIf="message">
      <strong>Error:</strong> {{ message }}
    </div>
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
  `],
})
export class ErrorBannerComponent {
  // PUBLIC_INTERFACE
  /** Error message to display */
  @Input() message: string | null = null;
}
