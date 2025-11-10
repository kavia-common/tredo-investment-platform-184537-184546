import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolioService } from '../../core/services/folio.service';

@Component({
  standalone: true,
  selector: 'app-explore',
  imports: [CommonModule],
  template: `
    <h2>Explore Folios</h2>
    <ul>
      <li *ngFor="let f of folios">{{ f.title }} <small class="text-muted">({{ f.slug }})</small></li>
    </ul>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent {
  private readonly folio = inject(FolioService);
  folios: any[] = [];

  ngOnInit(): void {
    this.folio.list().subscribe((d) => (this.folios = d));
  }
}
