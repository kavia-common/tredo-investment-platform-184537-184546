import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CardComponent - surface card with optional title and actions.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <header class="card-hdr" *ngIf="title || hasHeader">
        <div class="title" *ngIf="title">{{ title }}</div>
        <div class="actions"><ng-content select="[card-actions]"></ng-content></div>
      </header>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <footer class="card-ftr" *ngIf="hasFooter">
        <ng-content select="[card-footer]"></ng-content>
      </footer>
    </section>
  `,
  styles: [`
    .card {
      background: var(--ocean-surface);
      border: 1px solid var(--ocean-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .card-hdr, .card-ftr { padding: .75rem 1rem; }
    .card-hdr {
      display: flex;
      align-items: center;
      gap: .5rem;
      border-bottom: 1px solid var(--ocean-border);
    }
    .title { font-weight: 600; }
    .actions { margin-left: auto; display: flex; gap: .5rem; }
    .card-body { padding: 1rem; }
  `],
})
export class CardComponent {
  // PUBLIC_INTERFACE
  /** Optional title text for card header */
  @Input() title?: string;

  get hasHeader(): boolean { return false; }
  get hasFooter(): boolean { return false; }
}
