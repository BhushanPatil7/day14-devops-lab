import { useMemo, useState } from 'react'
import './ProductList.css'
import { products } from './products'
import type { Product, ProductListProps } from './types'

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)

/**
 * Exposed to other apps as "catalog/ProductList".
 * The shell app loads this file over the network at runtime.
 */
export default function ProductList({ onAdd }: ProductListProps) {
  const [query, setQuery] = useState<string>('')

  const visible = useMemo<Product[]>(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <section className="catalog" aria-label="Product catalog">
      <p className="catalog__badge">Served by the catalog remote (port 5001)</p>
      <label htmlFor="catalog-search">Search products</label>
      <input
        id="catalog-search"
        value={query}
        placeholder="e.g. lamp"
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            <span>
              {p.name} <small>({p.category})</small>
            </span>
            <span>{formatINR(p.price)}</span>
            <button type="button" onClick={() => onAdd?.(p)} disabled={!onAdd}>
              Add to cart
            </button>
          </li>
        ))}
        {visible.length === 0 && <li>No products match "{query}".</li>}
      </ul>
    </section>
  )
}
