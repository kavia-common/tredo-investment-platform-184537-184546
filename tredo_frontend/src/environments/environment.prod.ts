export const environment = {
  production: true,
  apiBase: (globalThis as any)?.process?.env?.NG_APP_API_BASE ?? '',
  backendUrl: (globalThis as any)?.process?.env?.NG_APP_BACKEND_URL ?? '',
  wsUrl: (globalThis as any)?.process?.env?.NG_APP_WS_URL ?? '',
  nodeEnv: (globalThis as any)?.process?.env?.NG_APP_NODE_ENV ?? 'production',
  featureFlags: (globalThis as any)?.process?.env?.NG_APP_FEATURE_FLAGS ?? '',
  experiments: (globalThis as any)?.process?.env?.NG_APP_EXPERIMENTS_ENABLED === 'true',
  frontendUrl: (globalThis as any)?.process?.env?.NG_APP_FRONTEND_URL ?? '',
};
