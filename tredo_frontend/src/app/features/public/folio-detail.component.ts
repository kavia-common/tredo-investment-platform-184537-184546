import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FolioService } from '../../core/services/folio.service';

@Component({
  standalone: true,
  selector: 'app-folio-detail',
  imports: [CommonModule],
  template: `
    <h2>Folio Detail</h2>
    <ng-container *ngIf="folio; else loading">
      <div><strong>{{ folio.title }}</strong></div>
      <div class="text-muted">{{ folio.description }}</div>
    </ng-container>
    <ng-template #loading>Loading...</ng-template>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolioDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(FolioService);

  folio: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe((f) => (this.folio = f));
  }
}
