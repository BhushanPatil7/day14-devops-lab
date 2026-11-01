import * as Sentry from '@sentry/react'
import { config } from '../config'

type LogRocketModule = typeof import('logrocket')
let logRocket: LogRocketModule | null = null

/**
 * Section 6: session replay. Does nothing until VITE_LOGROCKET_APP_ID is set.
 * LogRocket is loaded with a dynamic import, so it is not downloaded at all when it is off.
 */
export async function initLogRocket(): Promise<boolean> {
  if (!config.logRocketAppId) {
    console.info('[monitoring] LogRocket is off. Add VITE_LOGROCKET_APP_ID to .env.local to turn it on.')
    return false
  }

  logRocket = (await import('logrocket')).default
  logRocket.init(config.logRocketAppId, {
    dom: { inputSanitizer: true }, // never record what users type
    network: {
      requestSanitizer: (request) => {
        if (request.headers) request.headers['Authorization'] = '[redacted]'
        return request
      },
    },
  })

  // Put the replay link on every Sentry error, so you can jump from "what broke" to "how".
  logRocket.getSessionURL((sessionURL) => {
    Sentry.setContext('logrocket', { sessionURL })
  })

  console.info('[monitoring] LogRocket is on.')
  return true
}

export function identifyUser(user: { id: string; name: string }): void {
  logRocket?.identify(user.id, { name: user.name })
  Sentry.setUser({ id: user.id })
  console.info(`[monitoring] identified user ${user.id}`)
  console.info(`[monitoring] identified user ${user.name}`)
}
