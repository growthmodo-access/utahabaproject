import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ABA Therapy Blog | Expert Insights & Resources for Utah Families',
  description: 'Read expert articles about ABA therapy, treatment guides, insurance information, and resources for families in Utah seeking autism treatment.',
  keywords: 'ABA therapy blog, autism treatment articles, ABA therapy resources, Utah autism support',
  openGraph: {
    title: 'ABA Therapy Blog - Expert Resources',
    description: 'Expert insights and resources about ABA therapy',
    type: 'website',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
