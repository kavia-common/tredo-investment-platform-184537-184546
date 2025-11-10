import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * TableComponent - simple data table with headings and rows.
 * Accepts array of objects and column definitions.
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th *ngFor="let col of columns" (click)="sort.emit(col.key)">
              {{ col.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index">
            <td *ngFor="let col of columns">
              <ng-container [ngSwitch]="col.type">
                <span *ngSwitchCase="'template'">
                  <ng-container *ngTemplateOutlet="col.template; context: { $implicit: row, index: i }"></ng-container>
                </span>
                <span *ngSwitchDefault>{{ row[col.key] }}</span>
              </ng-container>
            </td>
          </tr>
          <tr *ngIf="!data || data.length === 0">
            <td [attr.colspan]="(columns && columns.length) ? columns.length : 1" class="empty">No data</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-wrap { width: 100%; overflow: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: .625rem .75rem; }
    thead th {
      position: sticky;
      top: 0;
      background: var(--ocean-surface);
      border-bottom: 1px solid var(--ocean-border);
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }
    tbody td { border-bottom: 1px solid var(--ocean-border); }
    .empty { text-align: center; color: var(--ocean-muted); }
  `],
})
export class TableComponent<T extends Record<string, any>> {
  // PUBLIC_INTERFACE
  /** Data array for rows */
  @Input() data: T[] = [];
  // PUBLIC_INTERFACE
  /** Column definitions: { key, header, type?, template? } */
  @Input() columns: Array<{ key: keyof T | string; header: string; type?: 'text' | 'template'; template?: any }> = [];
  // PUBLIC_INTERFACE
  /** Emits when a column header is clicked (for sort) */
  @Output() sort = new EventEmitter<string | keyof T>();
}
