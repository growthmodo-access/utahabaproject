import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ABA Therapy Providers Directory | Utah County Listings',
  description: 'Browse top-rated ABA therapy providers across all Utah counties. Find the best Applied Behavior Analysis services near you with detailed information, ratings, and contact details.',
  keywords: 'ABA therapy providers Utah, autism therapy directory, Utah county ABA services, behavior analysis providers',
  openGraph: {
    title: 'ABA Therapy Providers Directory - Utah',
    description: 'Find top-rated ABA therapy providers in every Utah county',
    type: 'website',
  },
}

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
