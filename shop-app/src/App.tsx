import { lazy, Suspense, useCallback, useState } from 'react'
import type { Product } from 'catalog/ProductList'
import { BreakTheApp } from './components/BreakTheApp'
import { EnvBadge } from './components/EnvBadge'
import { RemoteErrorBoundary } from './components/RemoteErrorBoundary'
import { identifyUser } from './monitoring/logrocket'

// Section 4: Module Federation. This import is resolved at RUNTIME from
// http://localhost:5001/remoteEntry.js, the catalog team's separately running app.
const ProductList = lazy(() => import('catalog/ProductList'))

export default function App() {
  const [cart, setCart] = useState<Product[]>([])
  const [user, setUser] = useState<string | null>(null)

  const handleAdd = useCallback((product: Product) => {
    setCart((prev) => [...prev, product])
  }, [])

  const login = () => {
    const demoUser = { id: 'student-01', name: 'Asha' }
    identifyUser(demoUser)
    setUser(demoUser.name)
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Shop shell (host)</h1>
        <EnvBadge />
        <span className="cart" aria-live="polite">
          Cart: {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </span>
      </header>

      <p className="intro">
        The header and cart belong to this <strong>shell</strong> app (port 5173 in dev, 4173 in preview). The product list below is loaded
        at runtime from the separately running <strong>catalog</strong> app (port 5001).
      </p>

      <RemoteErrorBoundary
        fallback={
          <p role="alert" className="alert">
            The catalog remote is not reachable. Start it with <code>npm run dev:mfe</code> from the project root.
          </p>
        }
      >
        <Suspense fallback={<p role="status">Loading catalog from the remote…</p>}>
          <ProductList onAdd={handleAdd} />
        </Suspense>
      </RemoteErrorBoundary>

      <section className="tools" aria-label="Monitoring lab">
        <h2>Monitoring lab (sections 5 and 6)</h2>
        <p>Open DevTools → Console to see whether Sentry and LogRocket are on.</p>
        <button type="button" onClick={login} disabled={user !== null}>
          {user ? `Logged in as ${user}` : 'Log in as demo user'}
        </button>
        <BreakTheApp />
      </section>
    </div>
  )
}
