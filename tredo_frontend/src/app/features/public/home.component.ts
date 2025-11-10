import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService, FolioService, Folio } from '../../core';
import { CardComponent, ButtonComponent, ChartPlaceholderComponent, TruncatePipe } from '../../shared';
import { Observable, combineLatest, map, startWith } from 'rxjs';

type HomeVM = {
  featured: Folio[];
  summary: { folios: number; analysts: number; subscribers: number } | null;
};

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, CardComponent, ChartPlaceholderComponent, TruncatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>Discover verified analyst folios</h1>
        <p class="sub">Subscribe to SEBI-licensed analysts, follow trades, and track performance with clarity.</p>
        <div class="cta">
          <a class="btn primary" routerLink="/explore">Explore folios</a>
          <a class="btn ghost" routerLink="/pricing">View pricing</a>
        </div>
        <div class="stats" *ngIf="vm$ | async as vm">
          <div class="stat"><strong>{{ vm.summary?.folios ?? 0 }}</strong><span>Folios</span></div>
          <div class="stat"><strong>{{ vm.summary?.analysts ?? 0 }}</strong><span>Analysts</span></div>
          <div class="stat"><strong>{{ vm.summary?.subscribers ?? 0 }}</strong><span>Subscribers</span></div>
        </div>
      </div>
      <div class="hero-art">
        <app-chart-placeholder title="Platform Performance" subtitle="Demo data"></app-chart-placeholder>
      </div>
    </section>

    <section class="section">
      <header class="section-hdr">
        <h2>Featured folios</h2>
        <a routerLink="/explore" class="view-all">View all</a>
      </header>
      <div class="folio-grid" *ngIf="vm$ | async as vm">
        <app-card *ngFor="let f of vm.featured" class="folio-card">
          <div class="fc-hdr">
            <h3 class="title">{{ f.title }}</h3>
            <div class="tags">
              <span class="tag" *ngFor="let t of (f.tags || [])">{{ t }}</span>
            </div>
          </div>
          <p class="desc">{{ f.description | truncate:140:false:'…' }}</p>
          <div class="metrics">
            <div><span class="k">1M</span><span class="v" [class.up]="(f.stats?.oneMonth || 0) >= 0" [class.down]="(f.stats?.oneMonth || 0) < 0">{{ (f.stats?.oneMonth ?? 0) | number:'1.0-2' }}%</span></div>
            <div><span class="k">1Y</span><span class="v" [class.up]="(f.stats?.oneYear || 0) >= 0" [class.down]="(f.stats?.oneYear || 0) < 0">{{ (f.stats?.oneYear ?? 0) | number:'1.0-2' }}%</span></div>
            <div><span class="k">All</span><span class="v" [class.up]="(f.stats?.allTime || 0) >= 0" [class.down]="(f.stats?.allTime || 0) < 0">{{ (f.stats?.allTime ?? 0) | number:'1.0-2' }}%</span></div>
          </div>
          <div class="actions">
            <a [routerLink]="['/folios', f.id]" class="btn secondary">View details</a>
          </div>
        </app-card>
      </div>
    </section>

    <section class="section benefits">
      <header class="section-hdr"><h2>Why Tredo</h2></header>
      <div class="benefit-grid">
        <app-card><h3>Verified Analysts</h3><p>Onboarded SEBI-licensed professionals with transparent history.</p></app-card>
        <app-card><h3>Actionable Signals</h3><p>Follow trades with clear entries, exits, and risk controls.</p></app-card>
        <app-card><h3>Transparent Metrics</h3><p>Track win rates and returns across multiple windows.</p></app-card>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 2rem;
      align-items: center;
      padding: 2rem 1rem;
      background: var(--ocean-bg-gradient);
    }
    @media (max-width: 960px) {
      .hero { grid-template-columns: 1fr; }
    }
    .hero-content h1 { font-size: clamp(1.75rem, 2vw + 1rem, 2.5rem); line-height: 1.1; margin-bottom: .5rem; }
    .hero-content .sub { color: var(--ocean-muted); margin-bottom: 1rem; }
    .cta { display: flex; gap: .5rem; margin-bottom: 1rem; }
    .btn { text-decoration: none; padding: .6rem .9rem; border-radius: var(--radius-md); border: 1px solid transparent; }
    .btn.primary { background: var(--ocean-primary); color: #fff; }
    .btn.ghost { background: transparent; border-color: var(--ocean-border); color: var(--ocean-text); }
    .stats { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: .75rem; margin-top: 1rem; }
    .stat { background: var(--ocean-surface); border: 1px solid var(--ocean-border); border-radius: var(--radius-lg); padding: .75rem; text-align: center; }
    .stat strong { font-size: 1.25rem; display: block; }
    .hero-art app-chart-placeholder { display: block; }

    .section { padding: 1.25rem 1rem; }
    .section-hdr { display: flex; align-items: center; gap: .5rem; margin-bottom: .75rem; }
    .section-hdr .view-all { margin-left: auto; text-decoration: none; color: var(--ocean-primary); }
    .folio-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; }
    @media (max-width: 1100px) { .folio-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
    @media (max-width: 680px) { .folio-grid { grid-template-columns: 1fr; } }
    .folio-card { padding: .75rem; display: grid; gap: .5rem; }
    .fc-hdr { display: flex; align-items: center; gap: .5rem; }
    .title { font-weight: 600; }
    .tags { margin-left: auto; display: flex; gap: .375rem; flex-wrap: wrap; }
    .tag { background: color-mix(in oklab, var(--ocean-primary) 8%, transparent); color: var(--ocean-primary); border: 1px solid var(--ocean-border); border-radius: 999px; padding: .15rem .5rem; font-size: .8rem; }
    .desc { color: var(--ocean-muted); }
    .metrics { display: flex; gap: 1rem; }
    .metrics .k { color: var(--ocean-muted); margin-right: .25rem; }
    .metrics .v.up { color: var(--ocean-success); }
    .metrics .v.down { color: var(--ocean-error); }
    .actions { margin-top: .25rem; }
    .benefit-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; }
    @media (max-width: 900px) { .benefit-grid { grid-template-columns: 1fr; } }
    .benefit-grid app-card { padding: .9rem; }
  `]
})
export class HomeComponent {
  private readonly folios = inject(FolioService);
  private readonly analytics = inject(AnalyticsService);

  vm$: Observable<HomeVM> = combineLatest({
    featured: this.folios.list({ page: 1, pageSize: 6 }).pipe(startWith([] as Folio[])),
    summary: this.analytics.getPlatformSummary().pipe(startWith(null)),
  }).pipe(map((r) => r));
}
