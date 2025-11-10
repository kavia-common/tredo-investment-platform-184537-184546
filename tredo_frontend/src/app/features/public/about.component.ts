import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CommonModule, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hdr">
      <h2>About Tredo</h2>
      <p class="muted">Connecting SEBI-licensed analysts with retail investors.</p>
    </section>

    <div class="grid">
      <app-card class="blk">
        <h3>Our Mission</h3>
        <p>We empower retail investors with transparent, verified investment strategies from qualified professionals.</p>
      </app-card>
      <app-card class="blk">
        <h3>How it works</h3>
        <p>Analysts publish folios and trades; subscribers can explore, subscribe, and follow along with clear risk controls.</p>
      </app-card>
      <app-card class="blk">
        <h3>Trust & Compliance</h3>
        <p>We prioritize compliance and accountability to build a safer investing environment.</p>
      </app-card>
    </div>

    <section class="faq">
      <h3>Frequently Asked Questions</h3>
      <app-card class="q">
        <strong>Who are the analysts?</strong>
        <p class="muted">SEBI-licensed professionals vetted during onboarding.</p>
      </app-card>
      <app-card class="q">
        <strong>Can I cancel anytime?</strong>
        <p class="muted">Yes, subscriptions can be cancelled and remain active till the period end.</p>
      </app-card>
    </section>
  `,
  styles: [`
    .hdr { margin-bottom: 1rem; }
    .muted { color: var(--ocean-muted); }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; }
    @media (max-width: 980px) { .grid { grid-template-columns: 1fr; } }
    .blk { padding: 1rem; display: grid; gap: .4rem; }
    .faq { margin-top: 1.25rem; display: grid; gap: .6rem; }
    .q { padding: .8rem; display: grid; gap: .25rem; }
  `]
})
export class AboutComponent {}
