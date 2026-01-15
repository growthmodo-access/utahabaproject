'use client'

import { useState } from 'react'
import { Provider } from '@/types/provider'
import { MapPin, Phone, Globe, Star, Award, PhoneCall, HelpCircle } from 'lucide-react'
import AssistanceForm from '@/components/AssistanceForm'

interface ProviderRowProps {
  provider: Provider
  rank?: number
  featured?: boolean
  tag?: string
}

export default function ProviderRow({ provider, rank, featured = false, tag }: ProviderRowProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <div className={`group border border-border rounded-xl bg-card hover:shadow-xl hover:border-foreground/20 transition-all duration-300 overflow-hidden ${featured ? 'ring-2 ring-yellow-400/30 bg-gradient-to-br from-card to-yellow-50/20' : ''}`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 p-5 sm:p-6 min-w-0">
          {/* Rank and Name Section */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-xs flex items-start lg:items-center gap-4 lg:gap-6 min-w-0">
            {rank && (
              <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-16 bg-gradient-to-br ${featured ? 'from-yellow-500 to-yellow-600' : 'from-foreground to-foreground/80'} text-background rounded-xl flex items-center justify-center font-bold text-lg sm:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {rank}
              </div>
            )}
            <div className="flex-1 lg:flex-none lg:min-w-[200px] lg:max-w-[280px] min-w-0">
              <div className="flex items-start gap-2 mb-2 flex-wrap">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors break-words">
                  {provider.name}
                </h3>
                {tag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-background rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm whitespace-nowrap">
                    <Star className="w-3 h-3 fill-background" />
                    {tag}
                  </span>
                )}
              </div>
              {provider.county && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{provider.city || ''} {provider.city && provider.county ? ', ' : ''}{provider.county} County</span>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground lg:hidden">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <a href={`tel:${provider.phone}`} className="hover:text-foreground transition-colors">
                    {provider.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Details Section - Better Organized */}
          <div className="flex-1 min-w-0 flex flex-col gap-3 lg:justify-center">
            {/* Description */}
            {provider.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {provider.description}
              </p>
            )}
            
            {/* Tags Section - All aligned left */}
            {provider.services && provider.services.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {provider.services.slice(0, 5).map((service, idx) => (
                  <span 
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
                  >
                    {service}
                  </span>
                ))}
              </div>
            )}

            {/* Contact & Info Section - All aligned left in a row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {provider.insuranceAccepted && provider.insuranceAccepted.length > 0 && (
                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                  {provider.insuranceAccepted.length} Insurance{provider.insuranceAccepted.length > 1 ? 's' : ''}
                </span>
              )}
              {provider.phone && (
                <a 
                  href={`tel:${provider.phone}`} 
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 hover:text-gray-900 transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{provider.phone}</span>
                </a>
              )}
              {provider.website && (
                <a 
                  href={provider.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 hover:text-gray-900 transition-colors whitespace-nowrap"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex-shrink-0 flex flex-col gap-2 w-full sm:w-auto lg:w-52">
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="group/cta inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-foreground/90 transition-all text-sm sm:text-base shadow-md hover:shadow-lg whitespace-nowrap w-full sm:w-auto"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="group/cta inline-flex items-center justify-center gap-2 border-2 border-border bg-background text-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-accent transition-all text-sm sm:text-base whitespace-nowrap w-full"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Get Assistance Now</span>
            </button>
          </div>
        </div>
      </div>

      <AssistanceForm
        providerName={provider.name}
        providerId={provider.id}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  )
}
