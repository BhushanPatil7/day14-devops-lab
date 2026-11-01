import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <h1>Rendering strategies lab</h1>
      <p>
        Each page below builds its HTML at a different time. Open a page, then use <strong>View Page Source</strong>{' '}
        (Ctrl+U) and compare the timestamps after refreshing.
      </p>
      <table>
        <thead>
          <tr>
            <th>Page</th>
            <th>Strategy</th>
            <th>HTML is built</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Link href="/products">/products</Link></td>
            <td>ISR</td>
            <td>At build time, then refreshed at most every 30 s</td>
          </tr>
          <tr>
            <td><Link href="/products/1">/products/[id]</Link></td>
            <td>SSG</td>
            <td>Once, at build time (generateStaticParams)</td>
          </tr>
          <tr>
            <td><Link href="/deals">/deals</Link></td>
            <td>SSR</td>
            <td>On the server, on every request</td>
          </tr>
          <tr>
            <td><Link href="/csr">/csr</Link></td>
            <td>CSR</td>
            <td>In the browser, after JavaScript loads</td>
          </tr>
        </tbody>
      </table>
      <p>
        Tip: timestamps only behave differently in a production build. Run <code>npm run build</code> then{' '}
        <code>npm run start</code>. In <code>npm run dev</code>, every page is rendered on every request.
      </p>
    </>
  )
}
