import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-pricing',
  template: `<section class="card"><h2>Pricing</h2><p>Plans for subscribers and analysts.</p></section>`,
  styles: [`.card{background:var(--ocean-surface);border:1px solid var(--ocean-border);border-radius:var(--radius-lg);padding:1rem;box-shadow:var(--shadow-sm);}`]
})
export class PricingComponent {}
