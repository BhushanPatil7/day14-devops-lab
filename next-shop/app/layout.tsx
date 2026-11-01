import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next Shop – SSR lab',
  description: 'Day 14 hands-on: rendering strategies in Next.js with TypeScript',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <strong>Next Shop</strong>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/products">Products (ISR)</Link>
            <Link href="/products/1">Product 1 (SSG)</Link>
            <Link href="/deals">Deals (SSR)</Link>
            <Link href="/csr">CSR demo</Link>
          </nav>
        </header>
        <main className="page">{children}</main>
      </body>
    </html>
  )
}
