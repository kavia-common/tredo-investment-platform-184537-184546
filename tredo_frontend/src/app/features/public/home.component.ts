import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `<section class="card"><h1>Welcome to Tredo</h1><p>Discover verified analyst folios and track performance.</p></section>`,
  styles: [`.card{background:var(--ocean-surface);border:1px solid var(--ocean-border);border-radius:var(--radius-lg);padding:1rem;box-shadow:var(--shadow-sm);}`]
})
export class HomeComponent {}
