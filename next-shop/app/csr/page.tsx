'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/lib/products'

// CSR, like your Vite apps: the server sends an empty shell and the browser fetches data.
// Use View Page Source here: the product names are NOT in the HTML.
export default function CsrPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let ignore = false
    fetch('/api/products')
      .then((res) => res.json() as Promise<Product[]>)
      .then((data) => {
        if (!ignore) {
          setProducts(data)
          setLoading(false)
        }
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <>
      <h1>CSR demo</h1>
      <p className="stamp">CSR · data fetched in the browser after JavaScript loaded</p>
      {loading ? (
        <p role="status">Loading in the browser…</p>
      ) : (
        <ul className="products">
          {products.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}
    </>
  )
}
