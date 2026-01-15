import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Is ABA Therapy Right for You? | Free Assessment Quiz',
  description: 'Take our free quiz to determine if ABA therapy could be beneficial for you or your loved one. Get personalized recommendations based on your responses.',
  keywords: 'ABA therapy assessment, autism treatment quiz, ABA therapy benefits, autism evaluation',
  openGraph: {
    title: 'ABA Therapy Benefit Quiz',
    description: 'Determine if ABA therapy is right for you',
    type: 'website',
  },
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
