import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolioService, Folio } from '../../core';
import { CardComponent } from '../../shared/components/card.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-explore',
  imports: [CommonModule, CardComponent, TruncatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hdr">
      <h2>Explore Folios</h2>
      <div class="search">
        <input type="text" [value]="q$.value" (input)="onQ($any($event.target).value)" placeholder="Search folios, tags, analysts…" />
      </div>
    </header>

    <div class="grid" *ngIf="vm$ | async as vm">
      <app-card class="item" *ngFor="let f of vm">
        <div class="row">
          <h3 class="title">{{ f.title }}</h3>
          <div class="tags">
            <span class="tag" *ngFor="let t of (f.tags || [])">{{ t }}</span>
          </div>
        </div>
        <p class="desc">{{ f.description | truncate:160 }}</p>
        <div class="row metrics">
          <span class="k">1M</span><span class="v" [class.up]="(f.stats?.oneMonth||0)>=0" [class.down]="(f.stats?.oneMonth||0)<0">{{ (f.stats?.oneMonth ?? 0) | number:'1.0-2' }}%</span>
          <span class="k">1Y</span><span class="v" [class.up]="(f.stats?.oneYear||0)>=0" [class.down]="(f.stats?.oneYear||0)<0">{{ (f.stats?.oneYear ?? 0) | number:'1.0-2' }}%</span>
          <span class="k">All</span><span class="v" [class.up]="(f.stats?.allTime||0)>=0" [class.down]="(f.stats?.allTime||0)<0">{{ (f.stats?.allTime ?? 0) | number:'1.0-2' }}%</span>
          <a class="btn link" [routerLink]="['/folios', f.id]">Details</a>
        </div>
      </app-card>
    </div>

    <div class="empty" *ngIf="(vm$ | async)?.length === 0">
      No folios found. Try a different query.
    </div>
  `,
  styles: [`
    .hdr { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .hdr h2 { font-size: 1.5rem; }
    .search { margin-left: auto; }
    .search input {
      width: min(360px, 60vw);
      padding: .55rem .7rem;
      border: 1px solid var(--ocean-border);
      border-radius: var(--radius-md);
      background: var(--ocean-surface);
      color: var(--ocean-text);
      outline: none;
    }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .9rem; }
    @media (max-width: 920px) { .grid { grid-template-columns: 1fr; } }
    .item { padding: .85rem; display: grid; gap: .5rem; }
    .row { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; }
    .title { font-weight: 600; }
    .tags { margin-left: auto; display: flex; gap: .375rem; flex-wrap: wrap; }
    .tag { background: color-mix(in oklab, var(--ocean-primary) 8%, transparent); color: var(--ocean-primary); border: 1px solid var(--ocean-border); border-radius: 999px; padding: .15rem .5rem; font-size: .8rem; }
    .desc { color: var(--ocean-muted); }
    .metrics { gap: .75rem; }
    .k { color: var(--ocean-muted); }
    .v.up { color: var(--ocean-success); }
    .v.down { color: var(--ocean-error); }
    .btn.link { margin-left: auto; text-decoration: none; border: 1px solid var(--ocean-border); border-radius: var(--radius-md); padding: .35rem .6rem; color: var(--ocean-text); }
    .empty { color: var(--ocean-muted); text-align: center; padding: 2rem 0; }
  `]
})
export class ExploreComponent {
  private readonly folios = inject(FolioService);

  q$ = new BehaviorSubject<string>('');

  vm$: Observable<Folio[]> = combineLatest([this.q$]).pipe(
    switchMap(([q]) => this.folios.list({ q: q || undefined, page: 1, pageSize: 24 })),
    map(items => items || [])
  );

  onQ(q: string) { this.q$.next(q); }
}
