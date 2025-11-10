import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-folio-detail',
  template: `<section class="card"><h2>Folio Detail</h2><p>Folio details and performance.</p></section>`,
  styles: [`.card{background:var(--ocean-surface);border:1px solid var(--ocean-border);border-radius:var(--radius-lg);padding:1rem;box-shadow:var(--shadow-sm);}`]
})
export class FolioDetailComponent {}
