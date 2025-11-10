import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiService } from './api.service';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class PaymentService {
  /** Service to initiate and confirm payments. */
  private readonly api = inject(BaseApiService);

  // PUBLIC_INTERFACE
  createCheckoutSession(folioId: string): Observable<{ checkoutUrl: string }> {
    if (this.api.mock) {
      return of({ checkoutUrl: '/mock-checkout' });
    }
    return this.api.post<{ checkoutUrl: string }>('/payments/checkout', { folioId });
  }

  // PUBLIC_INTERFACE
  confirmPayment(sessionId: string): Observable<{ status: string }> {
    if (this.api.mock) return of({ status: 'succeeded' });
    return this.api.post<{ status: string }>('/payments/confirm', { sessionId });
  }
}
