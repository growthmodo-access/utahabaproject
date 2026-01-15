'use client'

import { Provider } from '@/types/provider'
import { MapPin, Phone, Globe, Star, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ProviderCardProps {
  provider: Provider
  rank?: number
}

export default function ProviderCard({ provider, rank }: ProviderCardProps) {
  return (
    <div className="group border border-border rounded-xl bg-card hover:shadow-xl hover:border-foreground/20 transition-all duration-300 overflow-hidden">
      <Link href={`/directory/${provider.id}`} className="block p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2.5">
              {rank && (
                <div className="flex-shrink-0 bg-gradient-to-br from-foreground to-foreground/80 text-background rounded-lg w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                  {rank}
                </div>
              )}
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                {provider.name}
              </h3>
            </div>
            {provider.rating && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-foreground">{provider.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">Rating</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {provider.county && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{provider.city || ''} {provider.city && provider.county ? ', ' : ''}{provider.county} County</span>
            </div>
          )}
          {provider.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <a 
                href={`tel:${provider.phone}`} 
                onClick={(e) => e.stopPropagation()}
                className="hover:text-foreground transition-colors truncate"
              >
                {provider.phone}
              </a>
            </div>
          )}
          {provider.website && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <a 
                href={provider.website} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-foreground transition-colors truncate"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {provider.description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{provider.description}</p>
        )}

        {provider.services && provider.services.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {provider.services.slice(0, 3).map((service, idx) => (
                <span 
                  key={idx}
                  className="bg-accent text-accent-foreground px-2.5 py-1 rounded-lg text-xs font-medium border border-border"
                >
                  {service}
                </span>
              ))}
              {provider.services.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">+{provider.services.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {provider.certifications && provider.certifications.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Award className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{provider.certifications[0]}</span>
            {provider.certifications.length > 1 && (
              <span className="text-muted-foreground/60">+{provider.certifications.length - 1}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <span className="text-xs sm:text-sm font-medium text-foreground">View Details</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </div>
  )
}
