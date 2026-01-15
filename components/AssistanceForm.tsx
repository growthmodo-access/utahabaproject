'use client'

import { useState } from 'react'
import { X, Send, User, Mail, Phone, MapPin, FileText } from 'lucide-react'

interface AssistanceFormProps {
  providerName: string
  providerId?: string
  isOpen: boolean
  onClose: () => void
}

export default function AssistanceForm({ providerName, providerId, isOpen, onClose }: AssistanceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    county: '',
    details: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Here you can integrate with your backend/email service
      // For now, we'll just log it and show success
      console.log('Assistance request:', {
        ...formData,
        providerName,
        providerId
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          county: '',
          details: ''
        })
      }, 2000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Get Assistance Now</h2>
            <p className="text-sm text-muted-foreground mt-1">Request help for: <span className="font-semibold text-foreground">{providerName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground">We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                placeholder="(801) 555-1234"
              />
            </div>

            <div>
              <label htmlFor="county" className="block text-sm font-medium text-foreground mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                County *
              </label>
              <input
                id="county"
                type="text"
                required
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                placeholder="Salt Lake, Utah, Davis, etc."
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-foreground mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Additional Details
              </label>
              <textarea
                id="details"
                rows={4}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background resize-none"
                placeholder="Tell us more about what you're looking for..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-border bg-background text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
