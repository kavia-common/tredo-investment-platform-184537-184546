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
};

// PUBLIC_INTERFACE
export function getEnvironment(): EnvironmentShape {
  /** Returns the current environment values for the app. */
  return env as EnvironmentShape;
}

// PUBLIC_INTERFACE
export function isMockMode(): boolean {
  /** Determines if app should run in mock mode based on feature flags. */
  try {
    const flags = (env.featureFlags || '').split(',').map(f => f.trim().toLowerCase());
    return flags.includes('mock') || flags.includes('mock-mode');
  } catch {
    return false;
  }
}
