import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flock — Church Administration Platform',
  description: 'Real-time attendance and report management for churches and denominations.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
