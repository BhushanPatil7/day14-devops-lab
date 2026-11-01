export type Product = {
  id: number
  name: string
  category: 'Lighting' | 'Decor' | 'Textiles'
  price: number
  description: string
}

const products: Product[] = [
  { id: 1, name: 'Brass lamp', category: 'Lighting', price: 1200, description: 'Hand-polished brass table lamp.' },
  { id: 2, name: 'Clay vase', category: 'Decor', price: 650, description: 'Terracotta vase, fired and hand-painted.' },
  { id: 3, name: 'Wall hanging', category: 'Decor', price: 900, description: 'Macramé wall hanging in natural cotton.' },
  { id: 4, name: 'Cotton cushion cover', category: 'Textiles', price: 450, description: 'Block-printed cushion cover, 16 × 16 in.' },
  { id: 5, name: 'Hanging lantern', category: 'Lighting', price: 1500, description: 'Perforated metal lantern with warm glow.' },
]

// Pretend this is a database or an API call that takes a moment.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts(): Promise<Product[]> {
  await delay(300)
  return products
}

export async function getProduct(id: number): Promise<Product | undefined> {
  await delay(200)
  return products.find((p) => p.id === id)
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)

export const renderedAt = () =>
  new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })
