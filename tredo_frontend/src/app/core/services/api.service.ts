import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiBase, isMockMode } from '../../shared/utils/env';

/**
 * BaseApiService standardizes HTTP calls with the configured API base.
 * Uses NG_APP_API_BASE when available, falling back to environment.apiBase.
 */
@Injectable({ providedIn: 'root' })
export class BaseApiService {
  private readonly http = inject(HttpClient);

  // PUBLIC_INTERFACE
  /** Returns the resolved API base URL. */
  get apiBase(): string {
    return getApiBase();
  }

  // PUBLIC_INTERFACE
  /** Whether the app runs in mock mode. */
  get mock(): boolean {
    // If API base is missing, default to mock to avoid SSR/network errors
    return isMockMode() || !this.apiBase;
  }

  // PUBLIC_INTERFACE
  /** Performs GET request with apiBase prefix. */
  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    const url = this.join(this.apiBase, path);
    const httpParams = this.toParams(params);
    return this.http.get<T>(url, { params: httpParams });
  }

  // PUBLIC_INTERFACE
  /** Performs POST request with apiBase prefix. */
  post<T>(path: string, body?: any, params?: Record<string, any>): Observable<T> {
    const url = this.join(this.apiBase, path);
    const httpParams = this.toParams(params);
    return this.http.post<T>(url, body, { params: httpParams });
  }

  // PUBLIC_INTERFACE
  /** Performs PUT request with apiBase prefix. */
  put<T>(path: string, body?: any, params?: Record<string, any>): Observable<T> {
    const url = this.join(this.apiBase, path);
    const httpParams = this.toParams(params);
    return this.http.put<T>(url, body, { params: httpParams });
  }

  // PUBLIC_INTERFACE
  /** Performs PATCH request with apiBase prefix. */
  patch<T>(path: string, body?: any, params?: Record<string, any>): Observable<T> {
    const url = this.join(this.apiBase, path);
    const httpParams = this.toParams(params);
    return this.http.patch<T>(url, body, { params: httpParams });
  }

  // PUBLIC_INTERFACE
  /** Performs DELETE request with apiBase prefix. */
  delete<T>(path: string, params?: Record<string, any>): Observable<T> {
    const url = this.join(this.apiBase, path);
    const httpParams = this.toParams(params);
    return this.http.delete<T>(url, { params: httpParams });
  }

  private join(base: string, path: string): string {
    if (!base) return path;
    if (base.endsWith('/') && path.startsWith('/')) return base + path.substring(1);
    if (!base.endsWith('/') && !path.startsWith('/')) return `${base}/${path}`;
    return base + path;
  }

  private toParams(obj?: Record<string, any>): HttpParams | undefined {
    if (!obj) return undefined;
    let params = new HttpParams();
    Object.entries(obj).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      params = params.set(k, String(v));
    });
    return params;
  }
}
