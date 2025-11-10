import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * NavbarComponent - top navigation bar with brand and links.
 * Uses Ocean Professional theme tokens and is SSR-safe.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="nav-root" [class.sticky]="sticky">
      <a class="brand" [routerLink]="brandLink">{{ brand }}</a>
      <nav class="nav">
        <a *ngFor="let link of links"
           class="nav-link"
           [routerLink]="link.path"
           (click)="onLinkClick(link); $event"
           routerLinkActive="active">{{ link.label }}</a>
        <ng-content select="[nav-actions]"></ng-content>
      </nav>
    </header>
  `,
  styles: [`
    .nav-root {
      top: 0;
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      padding: .875rem 1rem;
      background: var(--ocean-surface);
      border-bottom: 1px solid var(--ocean-border);
    }
    .nav-root.sticky { position: sticky; }
    .brand {
      font-weight: 700;
      color: var(--ocean-primary);
      text-decoration: none;
    }
    .nav { display: flex; gap: .5rem; align-items: center; }
    .nav-link {
      text-decoration: none;
      color: var(--ocean-text);
      padding: .375rem .5rem;
      border-radius: var(--radius-md);
      transition: background .2s ease;
    }
    .nav-link:hover {
      background: color-mix(in oklab, var(--ocean-primary) 8%, transparent);
    }
    .nav-link.active { color: var(--ocean-primary); }
  `],
})
export class NavbarComponent {
  // PUBLIC_INTERFACE
  /** Brand label on the left */
  @Input() brand = 'Tredo';
  // PUBLIC_INTERFACE
  /** Route link for brand */
  @Input() brandLink: string | any[] = '/';
  // PUBLIC_INTERFACE
  /** Links to display on right side */
  @Input() links: Array<{ label: string; path: string | any[] }> = [];
  // PUBLIC_INTERFACE
  /** Whether the navbar is sticky */
  @Input() sticky = true;
  // PUBLIC_INTERFACE
  /** Emits when a link is clicked (e.g. to handle logout) */
  @Output() linkClick = new EventEmitter<{ label: string; path: string | any[] }>();

  onLinkClick(link: { label: string; path: string | any[] }) {
    this.linkClick.emit(link);
  }
}
