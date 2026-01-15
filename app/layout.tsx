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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  
  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ABA Therapy Utah",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Find the best ABA therapy providers in Utah. Expert resources and directory for autism treatment services.",
    "sameAs": [
      // Add your social media URLs here when available
      // "https://www.facebook.com/yourpage",
      // "https://twitter.com/yourhandle",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "US-UT",
      "availableLanguage": "English"
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
