// Tell TypeScript what the remote module looks like.
// The real code arrives over the network at runtime from the catalog app.
declare module 'catalog/ProductList' {
  import type { ComponentType } from 'react'

  export type Product = {
    id: number
    name: string
    category: 'Lighting' | 'Decor' | 'Textiles'
    price: number
  }

  const ProductList: ComponentType<{ onAdd?: (product: Product) => void }>
  export default ProductList
}
