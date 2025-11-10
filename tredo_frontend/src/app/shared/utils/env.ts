import { environment as env } from '../../../environments/environment';

export type EnvironmentShape = {
  production: boolean;
  apiBase: string;
  backendUrl: string;
  wsUrl: string;
  nodeEnv: string;
  featureFlags: string;
  experiments: boolean;
  frontendUrl: string;

  // Derived/optional flags sourced from NG_APP_* if available
  port?: string | number;
  trustProxy?: boolean;
  logLevel?: string;
  healthcheckPath?: string;
  enableSourceMaps?: boolean;
  telemetryDisabled?: boolean;
};

/**
 * Internal: safely read from globalThis.process.env across SSR/browser.
 */
function readEnvVar(key: string): string | undefined {
  try {
    // Access guarded for SSR safety
    const g: any = (globalThis as any);
    return g?.process?.env?.[key];
  } catch {
    return undefined;
  }
}

// PUBLIC_INTERFACE
export function getEnvironment(): EnvironmentShape {
  /** Returns the current environment values for the app, merged with NG_APP_* runtime flags when present. */
  const merged: EnvironmentShape = {
    ...(env as EnvironmentShape),
    port: readEnvVar('NG_APP_PORT') ?? undefined,
    trustProxy: readEnvVar('NG_APP_TRUST_PROXY') === 'true',
    logLevel: readEnvVar('NG_APP_LOG_LEVEL') ?? undefined,
    healthcheckPath: readEnvVar('NG_APP_HEALTHCHECK_PATH') ?? undefined,
    enableSourceMaps: readEnvVar('NG_APP_ENABLE_SOURCE_MAPS') === 'true',
    telemetryDisabled: readEnvVar('NG_APP_NEXT_TELEMETRY_DISABLED') === 'true',
  };
  return merged;
}

// PUBLIC_INTERFACE
export function isMockMode(): boolean {
  /** Determines if app should run in mock mode based on feature flags or explicit NG_APP_FEATURE_FLAGS. */
  try {
    const flagsRaw = readEnvVar('NG_APP_FEATURE_FLAGS') ?? (env.featureFlags || '');
    const flags = (flagsRaw || '')
      .split(',')
      .map(f => f.trim().toLowerCase())
      .filter(Boolean);
    return flags.includes('mock') || flags.includes('mock-mode');
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function getApiBase(): string {
  /** Returns resolved API base URL preferring NG_APP_API_BASE if present. */
  return readEnvVar('NG_APP_API_BASE') ?? env.apiBase ?? '';
}

// PUBLIC_INTERFACE
export function getBackendUrl(): string {
  /** Returns resolved backend URL preferring NG_APP_BACKEND_URL if present. */
  return readEnvVar('NG_APP_BACKEND_URL') ?? env.backendUrl ?? '';
}

// PUBLIC_INTERFACE
export function getFrontendUrl(): string {
  /** Returns resolved frontend URL preferring NG_APP_FRONTEND_URL if present. */
  return readEnvVar('NG_APP_FRONTEND_URL') ?? env.frontendUrl ?? '';
}

// PUBLIC_INTERFACE
export function getWsUrl(): string {
  /** Returns resolved websocket URL preferring NG_APP_WS_URL if present. */
  return readEnvVar('NG_APP_WS_URL') ?? env.wsUrl ?? '';
}

// PUBLIC_INTERFACE
export function getNodeEnv(): string {
  /** Returns node environment preferring NG_APP_NODE_ENV if present. */
  return readEnvVar('NG_APP_NODE_ENV') ?? env.nodeEnv ?? 'development';
}
