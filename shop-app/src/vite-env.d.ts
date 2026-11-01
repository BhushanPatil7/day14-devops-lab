/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV_LABEL?: 'DEV' | 'QA' | 'PROD'
  readonly VITE_APP_VERSION?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_LOGROCKET_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
