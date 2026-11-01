'use client'

import { useState } from 'react'

// A Client Component: it needs state and a click handler, so it runs in the browser.
export function AddToCart({ id }: { id: number }) {
  const [added, setAdded] = useState<boolean>(false)

  return (
    <button type="button" onClick={() => setAdded(true)} disabled={added}>
      {added ? 'Added ✓' : `Add #${id}`}
    </button>
  )
}
