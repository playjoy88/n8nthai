import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'n8n Hosting Platform',
  description: 'n8n Hosting service for Thai customers with free trial and multiple pricing tiers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}
