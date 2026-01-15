'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Provider } from '@/types/provider'
import { MapPin, Phone, Mail, Globe, Star, Award, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProviderDetailPage() {
  const params = useParams()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const providerId = Array.isArray(params.id) ? params.id[0] : params.id
      const encodedId = encodeURIComponent(providerId)
      fetch(`/api/providers/${encodedId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Provider not found')
          }
          return res.json()
        })
        .then(data => {
          setProvider(data.provider)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching provider:', err)
          setLoading(false)
        })
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Provider Not Found</h1>
            <Link href="/directory" className="text-foreground hover:text-foreground/80 text-sm sm:text-base">
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-foreground hover:text-foreground/80 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">{provider.name}</h1>
            {provider.rating && (
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-semibold text-gray-700">{provider.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {provider.county && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-foreground/60 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">Location</p>
                  <p className="text-muted-foreground text-sm sm:text-base break-words">
                    {provider.city && `${provider.city}, `}{provider.county} County
                    {provider.address && <><br className="hidden sm:block" /><span className="block sm:inline">{provider.address}</span></>}
                  </p>
                </div>
              </div>
            )}

            {provider.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-foreground/60 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">Phone</p>
                  <a href={`tel:${provider.phone}`} className="text-foreground hover:text-foreground/80 text-sm sm:text-base break-all">
                    {provider.phone}
                  </a>
                </div>
              </div>
            )}

            {provider.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-foreground/60 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">Email</p>
                  <a href={`mailto:${provider.email}`} className="text-foreground hover:text-foreground/80 text-sm sm:text-base break-all">
                    {provider.email}
                  </a>
                </div>
              </div>
            )}

            {provider.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-foreground/60 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">Website</p>
                  <a 
                    href={provider.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-foreground/80 text-sm sm:text-base break-all"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}
          </div>

          {provider.description && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{provider.description}</p>
            </div>
          )}

          {provider.services && provider.services.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Services</h2>
              <div className="flex flex-wrap gap-2">
                {provider.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="bg-accent text-accent-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {provider.certifications && provider.certifications.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/60" />
                Certifications
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm sm:text-base">
                {provider.certifications.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {provider.insuranceAccepted && provider.insuranceAccepted.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Insurance Accepted</h2>
              <div className="flex flex-wrap gap-2">
                {provider.insuranceAccepted.map((insurance, idx) => (
                  <span
                    key={idx}
                    className="bg-accent text-accent-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                  >
                    {insurance}
                  </span>
                ))}
              </div>
            </div>
          )}

          {provider.yearsExperience && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Experience</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{provider.yearsExperience} years of experience</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
