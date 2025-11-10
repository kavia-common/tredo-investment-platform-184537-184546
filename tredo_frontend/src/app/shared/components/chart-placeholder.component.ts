import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * ChartPlaceholderComponent - displays a placeholder panel for charts until a chart lib is integrated.
 */
@Component({
  selector: 'app-chart-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="chart">
      <header class="hdr">
        <div class="title">{{ title }}</div>
        <div class="sub text-muted">{{ subtitle }}</div>
      </header>
      <div class="canvas">
        <div class="grid"></div>
        <div class="hint text-muted">Chart library not installed yet</div>
      </div>
    </section>
  `,
  styles: [`
    .chart {
      background: var(--ocean-surface);
      border: 1px solid var(--ocean-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    .hdr { padding: .75rem 1rem; border-bottom: 1px solid var(--ocean-border); }
    .title { font-weight: 600; }
    .sub { font-size: .85rem; }
    .canvas { position: relative; height: 220px; background: #fff; }
    .grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(to right, rgba(0,0,0,.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,.04) 1px, transparent 1px);
      background-size: 36px 36px;
    }
    .hint {
      position: absolute; bottom: .5rem; right: .75rem; font-size: .8rem;
    }
  `],
})
export class ChartPlaceholderComponent {
  // PUBLIC_INTERFACE
  /** Chart title */
  @Input() title = 'Performance';
  // PUBLIC_INTERFACE
  /** Chart subtitle or date range */
  @Input() subtitle = 'Last 30 days';
}
