import * as Sentry from '@sentry/react'
import { config } from '../config'

/** Section 5: production monitoring. Does nothing until VITE_SENTRY_DSN is set. */
export function initSentry(): boolean {
  if (!config.sentryDsn) {
    console.info('[monitoring] Sentry is off. Add VITE_SENTRY_DSN to .env.local to turn it on.')
    return false
  }

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.mode, // development | qa | production
    release: config.appVersion, // ties errors to a deploy
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0, // 100% for the lab; use ~0.1 in real production
  })
  console.info('[monitoring] Sentry is on.')
  return true
}
