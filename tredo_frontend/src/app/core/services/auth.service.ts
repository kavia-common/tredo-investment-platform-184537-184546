import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseApiService } from './api.service';
import { Observable, of, tap } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { getFrontendUrl } from '../../shared/utils/env';

type LoginResponse = { token: string; user: User };

// Key used for token storage
const TOKEN_KEY = 'tredo.jwt';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Service responsible for authentication and session management. */
  private readonly api = inject(BaseApiService);
  private readonly platformId = inject(PLATFORM_ID);

  private currentUser: User | null = null;

  // PUBLIC_INTERFACE
  /** Returns the current JWT token if available. SSR-safe. */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      // Access localStorage via globalThis to satisfy linters/SSR safety
      // Use loose typing to avoid relying on DOM lib types in SSR context
      const storage: any = (globalThis as any)?.localStorage;
      return storage ? storage.getItem(TOKEN_KEY) : null;
    } catch {
      return null;
    }
  }

  // PUBLIC_INTERFACE
  /** Sets the current JWT token. SSR-safe. */
  setToken(token: string | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const storage: any = (globalThis as any)?.localStorage;
      if (!storage) return;
      if (token) storage.setItem(TOKEN_KEY, token);
      else storage.removeItem(TOKEN_KEY);
    } catch {
      // ignore storage errors
    }
  }

  // PUBLIC_INTERFACE
  /** Returns the current authenticated user (if already fetched). */
  getUser(): User | null {
    return this.currentUser;
  }

  // PUBLIC_INTERFACE
  /** Whether the user is authenticated. */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // PUBLIC_INTERFACE
  /** Whether the authenticated user has one of the roles. */
  hasRole(roles: UserRole[] = []): boolean {
    if (!roles.length) return true;
    const user = this.currentUser;
    if (!user) return false;
    return roles.includes(user.role);
  }

  // PUBLIC_INTERFACE
  /** Perform login with email/password against backend or mock. */
  login(email: string, password: string): Observable<LoginResponse> {
    if (this.api.mock) {
      const mock: LoginResponse = {
        token: 'mock.jwt.token',
        user: { id: 'u1', email, name: 'Mock User', role: 'subscriber' },
      };
      return of(mock).pipe(tap((res) => this.onAuth(res)));
    }
    return this.api.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap((res) => this.onAuth(res)),
    );
  }

  // PUBLIC_INTERFACE
  /** Fetch current session user from backend. */
  me(): Observable<User> {
    if (this.api.mock) {
      const mock: User = { id: 'u1', email: 'mock@tredo.app', name: 'Mock User', role: 'subscriber' };
      this.currentUser = mock;
      return of(mock);
    }
    return this.api.get<User>('/auth/me').pipe(tap((u) => (this.currentUser = u)));
  }

  // PUBLIC_INTERFACE
  /** Logout by clearing token and notifying backend if needed. */
  logout(): Observable<void> {
    this.setToken(null);
    this.currentUser = null;
    if (this.api.mock) return of(void 0);
    return this.api.post<void>('/auth/logout', {});
  }

  // PUBLIC_INTERFACE
  /** Redirect helper back to login page. */
  redirectToLogin(): string {
    // Let router handle navigation in guards;
    // For external redirects (email links), we can use this URL.
    return `${getFrontendUrl() || ''}/login`;
  }

  private onAuth(res: LoginResponse) {
    this.setToken(res.token);
    this.currentUser = res.user;
  }
}
