import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiService } from './api.service';
import { User } from '../models/user.model';

/**
 * AdminService - Provides admin-only operations, with mock-mode fallbacks.
 */
// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class AdminService {
  /** Service to interact with admin endpoints. */
  private readonly api = inject(BaseApiService);

  // PUBLIC_INTERFACE
  /** Fetch overview metrics for admin dashboard. */
  overview(): Observable<{ users: number; analystsPending: number; folios: number; revenue?: number }> {
    if (this.api.mock) {
      return of({ users: 214, analystsPending: 2, folios: 37, revenue: 1250000 });
    }
    return this.api.get<{ users: number; analystsPending: number; folios: number; revenue?: number }>('/admin/overview');
  }

  // PUBLIC_INTERFACE
  /** List all users with basic fields (paginated later). */
  listUsers(): Observable<User[]> {
    if (this.api.mock) {
      const mock: User[] = [
        { id: 'u1', email: 'alice@example.com', name: 'Alice', role: 'subscriber' },
        { id: 'u2', email: 'bob@example.com', name: 'Bob', role: 'analyst' },
        { id: 'u3', email: 'carol@example.com', name: 'Carol', role: 'admin' },
      ];
      return of(mock);
    }
    return this.api.get<User[]>('/admin/users');
  }

  // PUBLIC_INTERFACE
  /** Approvals queue for analyst applications. */
  approvals(): Observable<Array<{ id: string; name: string; email: string; licenseId: string; submittedAt: string }>> {
    if (this.api.mock) {
      return of([
        { id: 'ap1', name: 'Ravi Kumar', email: 'ravi@example.com', licenseId: 'SEBI-RA-1234', submittedAt: new Date().toISOString() },
        { id: 'ap2', name: 'Priya Singh', email: 'priya@example.com', licenseId: 'SEBI-RA-5678', submittedAt: new Date().toISOString() },
      ]);
    }
    return this.api.get<Array<{ id: string; name: string; email: string; licenseId: string; submittedAt: string }>>('/admin/approvals');
  }

  // PUBLIC_INTERFACE
  /** Approve a pending analyst application. */
  approve(id: string): Observable<{ ok: boolean }> {
    if (this.api.mock) return of({ ok: true });
    return this.api.post<{ ok: boolean }>(`/admin/approvals/${id}/approve`, {});
  }

  // PUBLIC_INTERFACE
  /** Reject a pending analyst application. */
  reject(id: string, reason?: string): Observable<{ ok: boolean }> {
    if (this.api.mock) return of({ ok: true });
    return this.api.post<{ ok: boolean }>(`/admin/approvals/${id}/reject`, { reason });
  }

  // PUBLIC_INTERFACE
  /** List all folios across platform (registry). */
  foliosRegistry(): Observable<Array<{ id: string; title: string; analystId: string; visibility: string; updatedAt: string }>> {
    if (this.api.mock) {
      return of([
        { id: 'f1', title: 'Bluechip Dividend', analystId: 'a1', visibility: 'public', updatedAt: new Date().toISOString() },
        { id: 'f2', title: 'Growth Momentum', analystId: 'a2', visibility: 'subscribers', updatedAt: new Date().toISOString() },
      ]);
    }
    return this.api.get<Array<{ id: string; title: string; analystId: string; visibility: string; updatedAt: string }>>('/admin/folios');
  }

  // PUBLIC_INTERFACE
  /** Update platform settings (key-value pairs). */
  updateSettings(payload: Record<string, any>): Observable<{ ok: boolean }> {
    if (this.api.mock) return of({ ok: true });
    return this.api.post<{ ok: boolean }>('/admin/settings', payload);
  }

  // PUBLIC_INTERFACE
  /** Get platform settings. */
  getSettings(): Observable<Record<string, any>> {
    if (this.api.mock) {
      return of({
        allowPublicExplore: true,
        requireEmailVerification: true,
        maintenanceMode: false,
      });
    }
    return this.api.get<Record<string, any>>('/admin/settings');
  }
}
