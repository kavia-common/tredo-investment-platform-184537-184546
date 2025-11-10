import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * FooterComponent - footer with copyright and slot for extra content.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="content">
        <span>&copy; {{ year }} {{ brand }}</span>
        <div class="spacer"></div>
        <ng-content></ng-content>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 1rem;
      color: var(--ocean-muted);
      background: var(--ocean-surface);
      border-top: 1px solid var(--ocean-border);
    }
    .content {
      display: flex;
      gap: .75rem;
      align-items: center;
    }
    .spacer { flex: 1; }
  `],
})
export class FooterComponent {
  // PUBLIC_INTERFACE
  /** Brand to show in footer */
  @Input() brand = 'Tredo';
  // PUBLIC_INTERFACE
  /** Year override (defaults to current year) */
  @Input() year: number = new Date().getFullYear();
}
