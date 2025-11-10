import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <h1>Welcome to Tredo</h1>
    <p>Discover analyst folios, subscribe, and track performance.</p>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
