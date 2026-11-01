import ProductList from './ProductList'

// When you open http://localhost:5001 directly, the catalog runs on its own.
// That is the point of micro frontends: each team can develop and test alone.
export default function App() {
  return (
    <main className="page">
      <h1>Catalog remote (standalone)</h1>
      <p>
        This app exposes <code>./ProductList</code> through <code>remoteEntry.js</code>. Open the shell at{' '}
        <a href="http://localhost:5173">http://localhost:5173</a> to see it loaded inside another app.
      </p>
      <ProductList onAdd={(p) => alert(`Standalone mode: ${p.name}`)} />
    </main>
  )
}
