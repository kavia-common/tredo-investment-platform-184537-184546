import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardComponent, ButtonComponent, ChartPlaceholderComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-folio-detail',
  imports: [CardComponent, ButtonComponent, ChartPlaceholderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card [title]="'Folio #' + id">
      <p class="text-muted">Overview and performance</p>
      <div style="margin-top: .75rem;">
        <app-chart-placeholder title="Cumulative returns" subtitle="Since inception"></app-chart-placeholder>
      </div>
      <div style="display:flex; gap:.5rem; margin-top: 1rem;">
        <app-button variant="primary">Subscribe</app-button>
        <app-button variant="ghost">Share</app-button>
      </div>
    </app-card>
  `,
})
export class FolioDetailComponent {
  id: string | null = null;
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
