import Link from 'next/link'
import { formatINR, getProducts, renderedAt } from '@/lib/products'
import { AddToCart } from './AddToCart'

// ISR: build this page once, then regenerate it in the background at most every 30 seconds.
export const revalidate = 30

// A Server Component: it runs only on the server, can await data directly,
// and sends no JavaScript of its own to the browser.
export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <>
      <h1>Products</h1>
      <p className="stamp">ISR · HTML generated at {renderedAt()} IST</p>
      <ul className="products">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/products/${p.id}`}>{p.name}</Link>
            <span>{formatINR(p.price)}</span>
            {/* The only interactive part is a small Client Component. */}
            <AddToCart id={p.id} />
          </li>
        ))}
      </ul>
    </>
  )
}
