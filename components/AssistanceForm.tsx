'use client'

import { useState, useEffect } from 'react'
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-2xl font-bold text-gray-900">Get Assistance Now</h2>
            <p className="text-sm text-gray-600 mt-1 truncate">
              Request help for: <span className="font-semibold text-gray-900">{providerName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {success ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Request Submitted!</h3>
              <p className="text-gray-600">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form id="assistance-form" onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span>Full Name *</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span>Email Address *</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span>Phone Number *</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="(801) 555-1234"
                />
              </div>

              <div>
                <label htmlFor="county" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span>County *</span>
                </label>
                <input
                  id="county"
                  type="text"
                  required
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Salt Lake, Utah, Davis, etc."
                />
              </div>

              <div>
                <label htmlFor="details" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span>Additional Details</span>
                </label>
                <textarea
                  id="details"
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white resize-none text-gray-900 placeholder-gray-400"
                  placeholder="Tell us more about what you're looking for..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm" role="alert">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer - Sticky */}
        {!success && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="assistance-form"
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          </div>
        )}
      </div>
    </div>
  )
}
