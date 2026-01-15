'use client'

import { Provider } from '@/types/provider'
import { MapPin, Phone, Globe, Star, Award, ArrowRight, PhoneCall } from 'lucide-react'
import Link from 'next/link'

interface ProviderRowProps {
  provider: Provider
  rank?: number
  featured?: boolean
  tag?: string
}

export default function ProviderRow({ provider, rank, featured = false, tag }: ProviderRowProps) {
  return (
    <div className={`group border border-border rounded-xl bg-card hover:shadow-xl hover:border-foreground/20 transition-all duration-300 overflow-hidden ${featured ? 'ring-2 ring-yellow-400/30 bg-gradient-to-br from-card to-yellow-50/20' : ''}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 min-w-0">
        {/* Rank and Name Section */}
        <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-4 sm:gap-6 min-w-0">
          {rank && (
            <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-16 bg-gradient-to-br ${featured ? 'from-yellow-500 to-yellow-600' : 'from-foreground to-foreground/80'} text-background rounded-xl flex items-center justify-center font-bold text-lg sm:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {rank}
            </div>
          )}
          <div className="flex-1 sm:flex-none min-w-0 max-w-full">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors break-words">
                {provider.name}
              </h3>
              {tag && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-background rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                  <Star className="w-3 h-3 fill-background" />
                  {tag}
                </span>
              )}
            </div>
            {provider.county && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{provider.city || ''} {provider.city && provider.county ? ', ' : ''}{provider.county} County</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-4 lg:items-center">
          {provider.description && (
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 lg:line-clamp-1 lg:flex-1 lg:min-w-0">
              {provider.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 lg:gap-3 lg:flex-shrink-0">
            {provider.rating && (
              <div className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 bg-accent rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-foreground">{provider.rating.toFixed(1)}</span>
              </div>
            )}
            {provider.services && provider.services.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {provider.services.slice(0, 2).map((service, idx) => (
                  <span 
                    key={idx}
                    className="bg-accent text-accent-foreground px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                  >
                    {service}
                  </span>
                ))}
              </div>
            )}
            {provider.phone && (
              <a 
                href={`tel:${provider.phone}`} 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden"
              >
                <Phone className="w-4 h-4" />
                <span>{provider.phone}</span>
              </a>
            )}
            {provider.website && (
              <a 
                href={provider.website} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {provider.phone && (
            <a
              href={`tel:${provider.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="group/cta inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-foreground/90 transition-all text-sm sm:text-base shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          )}
          <Link
            href={`/directory/${encodeURIComponent(provider.id)}`}
            className="group/cta inline-flex items-center justify-center gap-2 border-2 border-border bg-background text-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-accent transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
