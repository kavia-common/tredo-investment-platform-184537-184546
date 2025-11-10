import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-explore',
  template: `<section class="card"><h2>Explore Folios</h2><p>Browse analyst folios.</p></section>`,
  styles: [`.card{background:var(--ocean-surface);border:1px solid var(--ocean-border);border-radius:var(--radius-lg);padding:1rem;box-shadow:var(--shadow-sm);}`]
})
export class ExploreComponent {}
