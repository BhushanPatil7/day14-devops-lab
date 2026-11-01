import { getProducts } from '@/lib/products'

// A Route Handler: a small JSON API inside the Next.js app, used by the CSR demo.
export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}
