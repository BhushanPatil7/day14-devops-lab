import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // New Next.js projects turn on "Cache Components" ('use cache' + cacheLife).
  // This lab teaches the classic rendering strategies from the Day 14 guide
  // (SSG, ISR with `revalidate`, SSR), so it is switched off here.
  // Going further: set it to true and convert /products to 'use cache' + cacheLife({ revalidate: 30 }).
  cacheComponents: false,
}

export default nextConfig
