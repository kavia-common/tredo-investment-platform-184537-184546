import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * SideNavComponent - left navigation suitable for dashboard shells.
 */
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidenav" [class.collapsed]="collapsed">
      <button class="collapse-btn" type="button" (click)="onToggle()" aria-label="Toggle menu">☰</button>
      <nav>
        <a *ngFor="let link of links"
           [routerLink]="link.path"
           routerLinkActive="active">{{ link.label }}</a>
      </nav>
      <ng-content select="[bottom]"></ng-content>
    </aside>
  `,
  styles: [`
    .sidenav {
      min-height: 100%;
      border-right: 1px solid var(--ocean-border);
      background: var(--ocean-surface);
      padding: .75rem;
      width: 240px;
      transition: width .2s ease;
    }
    .sidenav.collapsed { width: 64px; }
    .collapse-btn {
      all: unset;
      cursor: pointer;
      display: inline-block;
      padding: .375rem .5rem;
      border-radius: var(--radius-md);
      color: var(--ocean-text);
    }
    nav { display: flex; flex-direction: column; gap: .25rem; margin-top: .5rem; }
    a {
      padding: .5rem .625rem;
      border-radius: var(--radius-md);
      color: var(--ocean-text);
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a.active {
      background: color-mix(in oklab, var(--ocean-primary) 12%, transparent);
      color: var(--ocean-primary);
    }
  `],
})
export class SideNavComponent {
  // PUBLIC_INTERFACE
  /** Items to render as links */
  @Input() links: Array<{ label: string; path: string | any[] }> = [];
  // PUBLIC_INTERFACE
  /** Collapsed state of the menu */
  @Input() collapsed = false;
  // PUBLIC_INTERFACE
  /** Emits when user toggles the collapse button */
  @Output() toggle = new EventEmitter<boolean>();

  onToggle() {
    this.collapsed = !this.collapsed;
    this.toggle.emit(this.collapsed);
  }
}
