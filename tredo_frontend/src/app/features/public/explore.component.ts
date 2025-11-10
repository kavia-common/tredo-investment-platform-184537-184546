import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent, TableComponent } from '../../shared';

@Component({
  standalone: true,
  selector: 'app-explore',
  imports: [CardComponent, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card title="Explore folios">
      <app-table
        [columns]="columns"
        [data]="rows"
        (sort)="onSort($event)">
      </app-table>
    </app-card>
  `,
})
export class ExploreComponent {
  columns = [
    { key: 'name', header: 'Name' },
    { key: 'analyst', header: 'Analyst' },
    { key: 'aum', header: 'AUM' },
    { key: 'desc', header: 'Description' },
  ];
  rows = [
    { name: 'Alpha Momentum', analyst: 'R. Sharma', aum: '₹1.2Cr', desc: 'Momentum strategy focusing on NIFTY100.' },
    { name: 'Value Select', analyst: 'K. Iyer', aum: '₹85L', desc: 'Value-driven portfolio across midcaps.' },
  ];
  onSort(col: string) { console.log('sort', col); }
}
