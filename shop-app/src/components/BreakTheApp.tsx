import { useState } from 'react'

/**
 * Section 5 lab: throws during render so the Sentry ErrorBoundary catches it
 * and (when Sentry is on) reports it with a stack trace.
 */
export function BreakTheApp() {
  const [broken, setBroken] = useState<boolean>(false)
  if (broken) throw new Error('Sentry test error from Day 14 lab')

  return (
    <button type="button" className="danger" onClick={() => setBroken(true)}>
      Break the app (test Sentry)
    </button>
  )
}
