import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { defineConfig } from 'vite'

// The "catalog" team's app. It is built and deployed on its own,
// and EXPOSES its ProductList component to other apps at runtime.
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList.tsx',
      },
      shared: ['react', 'react-dom'], // one copy of React, shared with the shell
      dts: false, // the shell declares this remote's types by hand (shop-app/src/remotes.d.ts)
    }),
  ],
  server: { port: 5001, strictPort: true, origin: 'http://localhost:5001' },
  preview: { port: 5001, strictPort: true },
  build: { target: 'esnext' },
})
