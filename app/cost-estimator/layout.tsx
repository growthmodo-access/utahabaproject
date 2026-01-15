import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ABA Therapy Cost Estimator | Calculate Treatment Costs in Utah',
  description: 'Get personalized estimates for ABA therapy costs in Utah. Factor in insurance coverage, location, and treatment intensity to understand your potential expenses.',
  keywords: 'ABA therapy cost, autism treatment cost, Utah ABA pricing, insurance coverage ABA',
  openGraph: {
    title: 'ABA Therapy Cost Estimator - Utah',
    description: 'Calculate estimated costs for ABA therapy treatment',
    type: 'website',
  },
}

export default function CostEstimatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
