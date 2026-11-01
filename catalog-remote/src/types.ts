export type Product = {
  id: number
  name: string
  category: 'Lighting' | 'Decor' | 'Textiles'
  price: number
}

export type ProductListProps = {
  /** Called when the user clicks "Add to cart". Supplied by the host (shell) app. */
  onAdd?: (product: Product) => void
}
