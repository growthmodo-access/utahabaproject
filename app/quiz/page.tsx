'use client'

import { useState } from 'react'
import { HelpCircle, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import EmailCapture from '@/components/EmailCapture'

interface Question {
  id: number
  question: string
  options: { value: string; label: string; score: number }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "Has your child been diagnosed with Autism Spectrum Disorder (ASD)?",
    options: [
      { value: 'yes', label: 'Yes, diagnosed', score: 10 },
      { value: 'evaluating', label: 'Currently being evaluated', score: 8 },
      { value: 'suspected', label: 'Suspected but not diagnosed', score: 6 },
      { value: 'no', label: 'No diagnosis', score: 2 }
    ]
  },
  {
    id: 2,
    question: "What age is the individual?",
    options: [
      { value: '0-3', label: '0-3 years (Early Intervention)', score: 10 },
      { value: '4-6', label: '4-6 years (Preschool)', score: 9 },
      { value: '7-12', label: '7-12 years (Elementary)', score: 8 },
      { value: '13-18', label: '13-18 years (Teen)', score: 7 },
      { value: '18+', label: '18+ years (Adult)', score: 6 }
    ]
  },
  {
    id: 3,
    question: "Are there challenges with communication or social skills?",
    options: [
      { value: 'severe', label: 'Significant challenges', score: 10 },
      { value: 'moderate', label: 'Moderate challenges', score: 7 },
      { value: 'mild', label: 'Mild challenges', score: 4 },
      { value: 'none', label: 'No significant challenges', score: 1 }
    ]
  },
  {
    id: 4,
    question: "Are there behavioral concerns (tantrums, aggression, self-injury)?",
    options: [
      { value: 'frequent', label: 'Frequent and significant', score: 10 },
      { value: 'occasional', label: 'Occasional', score: 6 },
      { value: 'rare', label: 'Rare', score: 3 },
      { value: 'none', label: 'No behavioral concerns', score: 1 }
    ]
  },
  {
    id: 5,
    question: "Are there challenges with daily living skills (feeding, dressing, hygiene)?",
    options: [
      { value: 'significant', label: 'Significant challenges', score: 9 },
      { value: 'moderate', label: 'Moderate challenges', score: 6 },
      { value: 'mild', label: 'Mild challenges', score: 3 },
      { value: 'none', label: 'No challenges', score: 1 }
    ]
  },
  {
    id: 6,
    question: "How is the individual's academic performance?",
    options: [
      { value: 'struggling', label: 'Significantly struggling', score: 9 },
      { value: 'below', label: 'Below grade level', score: 6 },
      { value: 'average', label: 'At grade level', score: 3 },
      { value: 'above', label: 'Above grade level', score: 1 }
    ]
  }
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [score, setScore] = useState<number | null>(null)
  const [showEmailCapture, setShowEmailCapture] = useState(false)

  const handleAnswer = (questionId: number, answerScore: number) => {
    setAnswers({ ...answers, [questionId]: answerScore })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = questions.length * 10
    const percentage = (totalScore / maxScore) * 100
    setScore(percentage)
    setShowEmailCapture(true)
  }

  const getResult = () => {
    if (!score) return null

    if (score >= 70) {
      return {
        title: 'ABA Therapy May Be Highly Beneficial',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        message: 'Based on your responses, ABA therapy could be very beneficial. We recommend consulting with a qualified ABA provider to discuss treatment options.',
        recommendation: 'Strongly consider exploring ABA therapy providers in your area.'
      }
    } else if (score >= 50) {
      return {
        title: 'ABA Therapy May Be Beneficial',
        icon: CheckCircle,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        message: 'ABA therapy could provide valuable support. Consider speaking with an ABA provider to determine if it\'s the right fit for your situation.',
        recommendation: 'We recommend exploring ABA therapy options and consulting with providers.'
      }
    } else if (score >= 30) {
      return {
        title: 'ABA Therapy May Provide Some Benefits',
        icon: HelpCircle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        message: 'ABA therapy might offer some benefits, but other interventions may also be appropriate. Consider discussing options with healthcare providers.',
        recommendation: 'Consider consulting with multiple types of therapists to find the best fit.'
      }
    } else {
      return {
        title: 'Other Interventions May Be More Appropriate',
        icon: XCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        message: 'Based on your responses, other types of therapy or support may be more suitable. However, ABA can still be beneficial for skill development.',
        recommendation: 'Consider exploring other therapeutic options or speak with a healthcare provider for guidance.'
      }
    }
  }

  const result = getResult()
  const currentAnswer = answers[questions[currentQuestion]?.id]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (score !== null && result) {
    const ResultIcon = result.icon
    return (
      <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className={`bg-card border-2 ${result.borderColor} rounded-lg shadow-sm p-5 sm:p-6 md:p-8`}>
            <div className="text-center mb-6">
              <ResultIcon className={`w-12 h-12 sm:w-16 sm:h-16 ${result.color} mx-auto mb-4`} />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">{result.title}</h1>
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">{Math.round(score)}%</div>
            </div>
            
            <div className={`${result.bgColor} rounded-lg p-4 sm:p-6 mb-4 sm:mb-6`}>
              <p className="text-sm sm:text-base md:text-lg text-foreground mb-3 sm:mb-4">{result.message}</p>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground"><strong className="text-foreground">Recommendation:</strong> {result.recommendation}</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <a
                href="/directory"
                className="block w-full bg-foreground text-background text-center py-3 px-6 rounded-lg font-medium hover:bg-foreground/90 transition-colors text-sm sm:text-base"
              >
                Browse ABA Providers in Utah
              </a>
              <a
                href="/cost-estimator"
                className="block w-full border border-border bg-background text-foreground text-center py-3 px-6 rounded-lg font-medium hover:bg-accent transition-colors text-sm sm:text-base"
              >
                Estimate ABA Therapy Costs
              </a>
            </div>
          </div>

          {showEmailCapture && (
            <div className="mt-6 sm:mt-8">
              <EmailCapture 
                source="quiz"
                onSuccess={() => setShowEmailCapture(false)}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-foreground mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Is ABA Therapy Right for You?
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Take our quiz to determine if ABA therapy could be beneficial
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm p-5 sm:p-6 md:p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-accent rounded-full h-2">
              <div 
                className="bg-foreground h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
              {questions[currentQuestion].question}
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(questions[currentQuestion].id, option.score)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-base ${
                    currentAnswer === option.score
                      ? 'border-foreground bg-accent'
                      : 'border-border hover:border-foreground/50 hover:bg-accent/50'
                  }`}
                >
                  <span className="font-medium text-foreground">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-border text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={!currentAnswer}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
