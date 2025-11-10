import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ModalComponent - lightweight modal dialog with header/body/footer slots.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" *ngIf="open" (click)="backdropClick()" aria-hidden="true"></div>
    <section class="modal" *ngIf="open" role="dialog" aria-modal="true" [attr.aria-label]="ariaLabel">
      <header class="modal-hdr">
        <div class="title">{{ title }}</div>
        <button class="close" type="button" (click)="close.emit()">✕</button>
      </header>
      <div class="modal-body">
        <ng-content></ng-content>
      </div>
      <footer class="modal-ftr">
        <ng-content select="[modal-actions]"></ng-content>
      </footer>
    </section>
  `,
  styles: [`
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.35);
      backdrop-filter: blur(1px);
    }
    .modal {
      position: fixed; inset: 0;
      margin: auto;
      width: min(640px, calc(100% - 2rem));
      height: fit-content;
      background: var(--ocean-surface);
      border: 1px solid var(--ocean-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    .modal-hdr, .modal-ftr { padding: .75rem 1rem; }
    .modal-hdr {
      display: flex; align-items: center; gap: .5rem;
      border-bottom: 1px solid var(--ocean-border);
    }
    .title { font-weight: 600; }
    .close {
      margin-left: auto; background: transparent; border: none;
      cursor: pointer; font-size: 1.1rem;
    }
    .modal-body { padding: 1rem; }
    .modal-ftr { border-top: 1px solid var(--ocean-border); display: flex; gap: .5rem; justify-content: flex-end; }
  `],
})
export class ModalComponent {
  // PUBLIC_INTERFACE
  /** Whether the modal is open */
  @Input() open = false;
  // PUBLIC_INTERFACE
  /** Title for the modal header */
  @Input() title = '';
  // PUBLIC_INTERFACE
  /** Accessible label for dialog */
  @Input() ariaLabel = 'Dialog';
  // PUBLIC_INTERFACE
  /** Emits when modal requests close */
  @Output() close = new EventEmitter<void>();

  backdropClick() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(e: any) {
    // SSR safe: event listener only runs in browser
    this.close.emit();
  }
}
