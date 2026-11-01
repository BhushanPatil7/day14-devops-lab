// Single place that reads VITE_ variables (Day 12). Everything else imports from here.
type EnvLabel = 'DEV' | 'QA' | 'PROD'

export const config = {
  mode: import.meta.env.MODE,
  envLabel: (import.meta.env.VITE_ENV_LABEL ?? 'DEV') as EnvLabel,
  appVersion: import.meta.env.VITE_APP_VERSION ?? '0.0.0-local',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN ?? '',
  logRocketAppId: import.meta.env.VITE_LOGROCKET_APP_ID ?? '',
}
