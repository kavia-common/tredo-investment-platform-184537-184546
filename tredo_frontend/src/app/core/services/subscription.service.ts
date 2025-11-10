import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiService } from './api.service';
import { Subscription } from '../models/subscription.model';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  /** Service for subscription lifecycle management. */
  private readonly api = inject(BaseApiService);

  // PUBLIC_INTERFACE
  mySubscriptions(): Observable<Subscription[]> {
    if (this.api.mock) {
      const mock: Subscription[] = [
        {
          id: 's1',
          userId: 'u1',
          folioId: 'f1',
          status: 'active',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          unitAmount: 99900,
          currency: 'INR',
          createdAt: new Date().toISOString(),
          cancelAtPeriodEnd: false,
        },
      ];
      return of(mock);
    }
    return this.api.get<Subscription[]>('/subscriptions/me');
  }

  // PUBLIC_INTERFACE
  subscribe(folioId: string): Observable<Subscription> {
    if (this.api.mock) {
      const now = new Date();
      const mock: Subscription = {
        id: 's_mock',
        userId: 'u1',
        folioId,
        status: 'active',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        unitAmount: 99900,
        currency: 'INR',
        createdAt: now.toISOString(),
        cancelAtPeriodEnd: false,
      };
      return of(mock);
    }
    return this.api.post<Subscription>('/subscriptions', { folioId });
  }

  // PUBLIC_INTERFACE
  cancel(id: string): Observable<void> {
    if (this.api.mock) return of(void 0);
    return this.api.post<void>(`/subscriptions/${id}/cancel`, {});
  }
}
