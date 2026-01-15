'use client'

import { useState } from 'react'
import { HelpCircle, CheckCircle, XCircle, ArrowRight, ArrowLeft, Sparkles, TrendingUp, BookOpen } from 'lucide-react'
import EmailCapture from '@/components/EmailCapture'
import Link from 'next/link'

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
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' })
  const [showUserInfoForm, setShowUserInfoForm] = useState(false)
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(false)

  const handleAnswer = (questionId: number, answerScore: number) => {
    setAnswers({ ...answers, [questionId]: answerScore })
  }

  const nextQuestion = () => {
    // Show user info form after question 3 (middle of quiz)
    if (currentQuestion === 2 && !userInfoSubmitted) {
      setShowUserInfoForm(true)
      return
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInfo.name && userInfo.email && userInfo.phone) {
      setUserInfoSubmitted(true)
      setShowUserInfoForm(false)
      // Continue to next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      }
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
    
    // If user info was collected, submit to Klaviyo or store it
    if (userInfoSubmitted && userInfo.name && userInfo.email) {
      // You can add API call here to save user info
      // For now, we'll just show the email capture
    }
    
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
      <div className="flex flex-col min-h-screen bg-white">
        {/* Results Hero Section */}
        <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white to-gray-50/90" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <ResultIcon className={`w-16 h-16 sm:w-20 sm:h-20 ${result.color} mx-auto mb-6`} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              {result.title}
            </h1>
            <div className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">{Math.round(score)}%</span>
              <span className="text-sm sm:text-base text-muted-foreground">Match Score</span>
            </div>
          </div>
        </section>

        {/* Results Content */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-card border-2 ${result.borderColor} rounded-xl shadow-lg p-6 sm:p-8 md:p-10 mb-8`}>
              <div className={`${result.bgColor} rounded-lg p-6 sm:p-8 mb-6 sm:mb-8`}>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">What This Means</h2>
                <p className="text-sm sm:text-base md:text-lg text-foreground mb-4 leading-relaxed">{result.message}</p>
                <div className="bg-white/50 rounded-lg p-4 mt-4">
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    <strong className="text-foreground">Our Recommendation:</strong> {result.recommendation}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/directory"
                  className="block w-full bg-foreground text-background text-center py-4 px-6 rounded-xl font-semibold hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Browse ABA Providers in Utah
                  <ArrowRight className="w-5 h-5 inline-block ml-2" />
                </Link>
                <Link
                  href="/cost-estimator"
                  className="block w-full border-2 border-border bg-background text-foreground text-center py-4 px-6 rounded-xl font-semibold hover:bg-accent transition-all text-sm sm:text-base"
                >
                  Estimate ABA Therapy Costs
                </Link>
                <Link
                  href="/blog"
                  className="block w-full border border-border bg-background text-foreground text-center py-4 px-6 rounded-xl font-medium hover:bg-accent transition-all text-sm sm:text-base"
                >
                  <BookOpen className="w-4 h-4 inline-block mr-2" />
                  Learn More About ABA Therapy
                </Link>
              </div>
            </div>

            {showEmailCapture && (
              <div className="mb-8">
                <EmailCapture 
                  source="quiz"
                  onSuccess={() => setShowEmailCapture(false)}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white to-gray-50/90" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-purple-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 mb-6 sm:mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">Interactive Assessment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
            Is ABA Therapy
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-foreground via-purple-600/20 to-foreground bg-clip-text text-transparent">
              Right for You?
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 leading-relaxed font-light">
            Take our interactive quiz to determine if ABA therapy could be beneficial for you or your loved one
          </p>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="max-w-4xl mx-auto">

        <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center text-xs sm:text-sm text-muted-foreground mb-3">
              <span className="font-medium">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="font-semibold text-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-accent rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* User Info Form - Show in middle of quiz */}
          {showUserInfoForm && !userInfoSubmitted && (
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 sm:p-8 mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Let&apos;s Get Your Contact Information</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">We&apos;ll use this to send you personalized results and recommendations.</p>
                <form onSubmit={handleUserInfoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    Continue Quiz
                    <ArrowRight className="w-5 h-5 inline-block ml-2" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Question */}
          {!showUserInfoForm && (
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(questions[currentQuestion].id, option.score)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all text-sm sm:text-base hover:shadow-md ${
                      currentAnswer === option.score
                        ? 'border-foreground bg-gradient-to-r from-purple-50 to-purple-100 shadow-md'
                        : 'border-border hover:border-foreground/50 hover:bg-accent/50'
                    }`}
                  >
                    <span className={`font-medium ${currentAnswer === option.score ? 'text-foreground' : 'text-foreground'}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          {!showUserInfoForm && (
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-6 border-t border-border">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-border text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base w-full sm:w-auto font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={!currentAnswer}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto font-semibold"
              >
                {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        </div>
      </section>
    </div>
  )
}
