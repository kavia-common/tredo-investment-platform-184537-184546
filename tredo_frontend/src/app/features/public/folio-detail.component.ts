import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FolioService, Folio, SubscriptionService, PaymentService } from '../../core';
import { CardComponent, ButtonComponent, ChartPlaceholderComponent } from '../../shared';
import { Observable, switchMap, map, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-folio-detail',
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, ChartPlaceholderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <header class="hdr">
        <div>
          <h2 class="title">{{ vm.title }}</h2>
          <p class="muted">{{ vm.description }}</p>
          <div class="tags" *ngIf="vm.tags?.length">
            <span class="tag" *ngFor="let t of vm.tags">{{ t }}</span>
          </div>
        </div>
        <div class="cta">
          <app-button variant="primary" (clicked)="onSubscribe(vm.id)">Subscribe</app-button>
          <a routerLink="/pricing" class="link">Pricing</a>
        </div>
      </header>

      <div class="grid">
        <app-card>
          <app-chart-placeholder title="Folio Performance" subtitle="All-time"></app-chart-placeholder>
        </app-card>

        <app-card>
          <div class="metrics">
            <div class="m"><span class="k">1M</span><span class="v" [class.up]="(vm.stats?.oneMonth||0)>=0" [class.down]="(vm.stats?.oneMonth||0)<0">{{ (vm.stats?.oneMonth ?? 0) | number:'1.0-2' }}%</span></div>
            <div class="m"><span class="k">3M</span><span class="v" [class.up]="(vm.stats?.threeMonths||0)>=0" [class.down]="(vm.stats?.threeMonths||0)<0">{{ (vm.stats?.threeMonths ?? 0) | number:'1.0-2' }}%</span></div>
            <div class="m"><span class="k">6M</span><span class="v" [class.up]="(vm.stats?.sixMonths||0)>=0" [class.down]="(vm.stats?.sixMonths||0)<0">{{ (vm.stats?.sixMonths ?? 0) | number:'1.0-2' }}%</span></div>
            <div class="m"><span class="k">1Y</span><span class="v" [class.up]="(vm.stats?.oneYear||0)>=0" [class.down]="(vm.stats?.oneYear||0)<0">{{ (vm.stats?.oneYear ?? 0) | number:'1.0-2' }}%</span></div>
            <div class="m"><span class="k">All</span><span class="v" [class.up]="(vm.stats?.allTime||0)>=0" [class.down]="(vm.stats?.allTime||0)<0">{{ (vm.stats?.allTime ?? 0) | number:'1.0-2' }}%</span></div>
          </div>
          <p class="muted">Performance metrics are indicative and may update with new trades.</p>
        </app-card>
      </div>
    </ng-container>

    <div class="loading" *ngIf="(vm$ | async) === null">
      Loading…
    </div>
  `,
  styles: [`
    .hdr { display: flex; gap: 1rem; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
    .title { font-size: 1.6rem; line-height: 1.1; }
    .muted { color: var(--ocean-muted); }
    .tags { margin-top: .5rem; display: flex; gap: .375rem; flex-wrap: wrap; }
    .tag { background: color-mix(in oklab, var(--ocean-primary) 8%, transparent); color: var(--ocean-primary); border: 1px solid var(--ocean-border); border-radius: 999px; padding: .15rem .5rem; font-size: .8rem; }
    .cta { display: flex; gap: .5rem; align-items: center; }
    .link { color: var(--ocean-primary); text-decoration: none; }
    .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
    @media (max-width: 980px) { .grid { grid-template-columns: 1fr; } }
    app-card { display: block; overflow: hidden; }
    .metrics { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: .5rem; margin-bottom: .5rem; }
    @media (max-width: 720px) { .metrics { grid-template-columns: repeat(2, minmax(0,1fr)); } }
    .m { background: var(--ocean-surface); border: 1px solid var(--ocean-border); border-radius: var(--radius-md); padding: .6rem .75rem; display: flex; align-items: center; gap: .5rem; }
    .k { color: var(--ocean-muted); }
    .v.up { color: var(--ocean-success); }
    .v.down { color: var(--ocean-error); }
    .loading { color: var(--ocean-muted); }
  `]
})
export class FolioDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly folios = inject(FolioService);
  private readonly payments = inject(PaymentService);
  private readonly subs = inject(SubscriptionService);

  vm$: Observable<Folio | null> = this.route.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => id ? this.folios.getById(id) : of(null))
  );

  // PUBLIC_INTERFACE
  /** Subscribe action: initiates checkout session; in mock mode navigates to a placeholder. */
  onSubscribe(folioId: string) {
    this.payments.createCheckoutSession(folioId).subscribe((res) => {
      // SSR-safe redirect: use globalThis to access location when available
      const g: any = (globalThis as any);
      if (res?.checkoutUrl && g?.location) {
        g.location.href = res.checkoutUrl;
      }
    });
  }
}
