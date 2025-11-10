import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiService } from './api.service';
import { Folio } from '../models/folio.model';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class FolioService {
  /** Service for browsing and managing folios. */
  private readonly api = inject(BaseApiService);

  // PUBLIC_INTERFACE
  list(params?: { q?: string; page?: number; pageSize?: number }): Observable<Folio[]> {
    if (this.api.mock) {
      const mock: Folio[] = [
        {
          id: 'f1',
          slug: 'bluechip-dividend',
          title: 'Bluechip Dividend',
          description: 'Large-cap dividend focus',
          analystId: 'a1',
          visibility: 'public',
          tags: ['dividend', 'large-cap'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: { oneMonth: 2.1, oneYear: 12.5, allTime: 30.2 },
        },
      ];
      return of(mock);
    }
    return this.api.get<Folio[]>('/folios', params);
  }

  // PUBLIC_INTERFACE
  getById(id: string): Observable<Folio> {
    if (this.api.mock) {
      const mock: Folio = {
        id,
        slug: 'mock-folio',
        title: 'Mock Folio',
        description: 'Demo folio',
        analystId: 'a1',
        visibility: 'public',
        tags: ['mock'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: { oneMonth: 1.2, oneYear: 8.4, allTime: 15.0 },
      };
      return of(mock);
    }
    return this.api.get<Folio>(`/folios/${id}`);
  }
}
