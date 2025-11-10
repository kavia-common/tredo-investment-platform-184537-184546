import { Injectable, inject } from '@angular/core';
import { BaseApiService } from './api.service';
import { Observable, of } from 'rxjs';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  /** Service to fetch aggregated analytics/statistics. */
  private readonly api = inject(BaseApiService);

  // PUBLIC_INTERFACE
  getPlatformSummary(): Observable<{ folios: number; analysts: number; subscribers: number }> {
    if (this.api.mock) return of({ folios: 12, analysts: 3, subscribers: 140 });
    return this.api.get<{ folios: number; analysts: number; subscribers: number }>('/analytics/summary');
  }
}
