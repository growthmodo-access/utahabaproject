import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ABA Therapy Providers in Utah | Find Top ABA Services',
  description: 'Discover the best ABA therapy providers in Utah. Find top-rated providers by county, read expert blog posts, and use our tools to estimate costs and determine if ABA therapy is right for you.',
  keywords: 'ABA therapy Utah, autism therapy, applied behavior analysis, Utah ABA providers, autism treatment',
  openGraph: {
    title: 'ABA Therapy Providers in Utah',
    description: 'Find the best ABA therapy providers in Utah by county',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
