import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'
import { initSentry } from './monitoring/sentry'
import { initLogRocket } from './monitoring/logrocket'

// Start monitoring before React renders anything.
initSentry()
void initLogRocket()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ resetError }) => (
        <div className="page" role="alert">
          <h1>Something went wrong</h1>
          <p>The error was reported (if Sentry is on). Check the Sentry Issues page.</p>
          <button type="button" onClick={resetError}>
            Try again
          </button>
        </div>
      )}
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
