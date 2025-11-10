import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-about',
  template: `<section class="card"><h2>About</h2><p>Tredo connects analysts with subscribers.</p></section>`,
  styles: [`.card{background:var(--ocean-surface);border:1px solid var(--ocean-border);border-radius:var(--radius-lg);padding:1rem;box-shadow:var(--shadow-sm);}`]
})
export class AboutComponent {}
