import { connection } from 'next/server'
import { formatINR, getProducts, renderedAt } from '@/lib/products'

// SSR: `await connection()` tells Next.js this page depends on the incoming request,
// so it is rendered on the server for EVERY request (never cached as static HTML).
export default async function DealsPage() {
  await connection()
  const products = await getProducts()

  // Pick a "deal of the minute" so you can see the page change between requests.
  const deal = products[new Date().getMinutes() % products.length]

  return (
    <>
      <h1>Deal of the minute</h1>
      <p className="stamp">SSR · HTML generated at {renderedAt()} IST (this request)</p>
      <p>
        <strong>{deal.name}</strong> at <strong>{formatINR(Math.round(deal.price * 0.8))}</strong>{' '}
        <s>{formatINR(deal.price)}</s>
      </p>
      <p>Refresh the page: the timestamp changes every time.</p>
    </>
  )
}
