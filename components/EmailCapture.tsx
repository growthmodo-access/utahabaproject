'use client'

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'

interface EmailCaptureProps {
  source: string
  onSuccess?: () => void
}

export default function EmailCapture({ source, onSuccess }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/klaviyo/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          source,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      setSuccess(true)
      setEmail('')
      setName('')
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Subscription error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-900 mb-2">Thank You!</h3>
        <p className="text-green-700">You've been successfully subscribed to our newsletter.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-6" role="region" aria-labelledby="email-capture-title">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-foreground" aria-hidden="true" />
        <h3 id="email-capture-title" className="text-xl font-semibold text-foreground">
          Get More Resources & Updates
        </h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Subscribe to receive helpful ABA therapy resources, provider updates, and expert tips.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Email subscription form">
        <div>
          <label htmlFor="name-input" className="sr-only">Your name</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
            aria-label="Your name (optional)"
          />
        </div>
        <div>
          <label htmlFor="email-input" className="sr-only">Your email address</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'email-error' : undefined}
            className="w-full border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
            aria-label="Your email address"
          />
        </div>
        {error && (
          <p id="email-error" className="text-red-600 text-sm" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background py-3 px-6 rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
          aria-busy={loading}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  )
}
