import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatINR, getProduct, getProducts, renderedAt } from '@/lib/products'

type ProductPageProps = {
  params: Promise<{ id: string }> // in Next.js 15+, params is a Promise
}

// SSG: pre-build one HTML page per product at build time.
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const products = await getProducts()
  return products.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(Number(id))
  return { title: product ? `${product.name} – Next Shop` : 'Not found' }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(Number(id))
  if (!product) notFound()

  return (
    <>
      <p>
        <Link href="/products">← All products</Link>
      </p>
      <h1>{product.name}</h1>
      <p className="stamp">SSG · HTML generated at {renderedAt()} IST (build time)</p>
      <p>{product.description}</p>
      <p>
        <strong>{formatINR(product.price)}</strong> · {product.category}
      </p>
    </>
  )
}
