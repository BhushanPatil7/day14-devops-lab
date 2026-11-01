import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig, type PluginOption } from 'vite'

// Where the catalog team's remoteEntry.js lives.
// Local default: the catalog dev/preview server. In CI/production set CATALOG_REMOTE_URL.
const catalogEntry = process.env.CATALOG_REMOTE_URL || 'http://localhost:5001/remoteEntry.js'

// Upload source maps to Sentry ONLY when an auth token is present (CI secret, never committed).
const sentryPlugins: PluginOption[] = process.env.SENTRY_AUTH_TOKEN
  ? [
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
      }),
    ]
  : []

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        catalog: { type: 'module', name: 'catalog', entry: catalogEntry },
      },
      shared: ['react', 'react-dom'],
      dts: false, // types for the remote are written by hand in src/remotes.d.ts
    }),
    ...sentryPlugins,
  ],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { target: 'esnext', sourcemap: true },
})
