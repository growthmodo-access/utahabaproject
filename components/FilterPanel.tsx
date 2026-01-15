'use client'

import { X, Filter } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface FilterOptions {
  insurance: string[]
  services: string[]
  ageGroups: string[]
  minRating: number
  certifications: string[]
  minExperience: number
}

interface FilterPanelProps {
  providers: any[]
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClear: () => void
}

export default function FilterPanel({ providers, filters, onFiltersChange, onClear }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  // Extract unique values from providers
  const allInsurance = Array.from(new Set(
    providers.flatMap(p => p.insuranceAccepted || [])
  )).sort()

  const allServices = Array.from(new Set(
    providers.flatMap(p => p.services || [])
  )).sort()

  const allAgeGroups = Array.from(new Set(
    providers.flatMap(p => p.ageGroups || [])
  )).sort()

  const allCertifications = Array.from(new Set(
    providers.flatMap(p => p.certifications || [])
  )).sort()

  const activeFilterCount = 
    filters.insurance.length +
    filters.services.length +
    filters.ageGroups.length +
    filters.certifications.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minExperience > 0 ? 1 : 0)

  const toggleInsurance = (insurance: string) => {
    const newInsurance = filters.insurance.includes(insurance)
      ? filters.insurance.filter(i => i !== insurance)
      : [...filters.insurance, insurance]
    onFiltersChange({ ...filters, insurance: newInsurance })
  }

  const toggleService = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service]
    onFiltersChange({ ...filters, services: newServices })
  }

  const toggleAgeGroup = (ageGroup: string) => {
    const newAgeGroups = filters.ageGroups.includes(ageGroup)
      ? filters.ageGroups.filter(a => a !== ageGroup)
      : [...filters.ageGroups, ageGroup]
    onFiltersChange({ ...filters, ageGroups: newAgeGroups })
  }

  const toggleCertification = (cert: string) => {
    const newCerts = filters.certifications.includes(cert)
      ? filters.certifications.filter(c => c !== cert)
      : [...filters.certifications, cert]
    onFiltersChange({ ...filters, certifications: newCerts })
  }

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls="filter-panel"
        aria-label={`${isOpen ? 'Close' : 'Open'} filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
      >
        <Filter className="w-4 h-4 text-gray-700" />
        <span className="text-sm font-medium text-gray-900">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-gray-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          {/* Modal */}
          <div
            ref={panelRef}
            id="filter-panel"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-panel-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false)
              }
            }}
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Sticky Header */}
              <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
                <h3 id="filter-panel-title" className="text-xl font-bold text-gray-900">Filter Providers</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Summary */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                    {activeFilterCount > 0 
                      ? `Showing ${providers.length} provider${providers.length !== 1 ? 's' : ''} with ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied.`
                      : `Showing ${providers.length} provider${providers.length !== 1 ? 's' : ''}.`
                    }
                  </p>
                </div>

                {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="mb-4 pb-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Active Filters</span>
                <button
                  onClick={onClear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.insurance.map(ins => (
                  <span
                    key={ins}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                  >
                    {ins}
                    <button
                      onClick={() => toggleInsurance(ins)}
                      className="hover:text-foreground"
                      aria-label={`Remove ${ins} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.services.map(service => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                  >
                    {service}
                    <button
                      onClick={() => toggleService(service)}
                      className="hover:text-foreground"
                      aria-label={`Remove ${service} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.ageGroups.map(age => (
                  <span
                    key={age}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                  >
                    {age}
                    <button
                      onClick={() => toggleAgeGroup(age)}
                      className="hover:text-foreground"
                      aria-label={`Remove ${age} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.certifications.map(cert => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                  >
                    {cert}
                    <button
                      onClick={() => toggleCertification(cert)}
                      className="hover:text-foreground"
                      aria-label={`Remove ${cert} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                    Rating ≥ {filters.minRating}
                    <button
                      onClick={() => onFiltersChange({ ...filters, minRating: 0 })}
                      className="hover:text-foreground"
                      aria-label="Remove minimum rating filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.minExperience > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded text-xs">
                    {filters.minExperience}+ years
                    <button
                      onClick={() => onFiltersChange({ ...filters, minExperience: 0 })}
                      className="hover:text-foreground"
                      aria-label="Remove minimum experience filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Insurance Filter */}
          {allInsurance.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Insurance Accepted</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {allInsurance.map(insurance => (
                  <label
                    key={insurance}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.insurance.includes(insurance)}
                      onChange={() => toggleInsurance(insurance)}
                      className="rounded border-border"
                      aria-label={`Filter by ${insurance} insurance`}
                    />
                    <span className="text-sm text-foreground">{insurance}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Services Filter */}
          {allServices.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Services Offered</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {allServices.map(service => (
                  <label
                    key={service}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.services.includes(service)}
                      onChange={() => toggleService(service)}
                      className="rounded border-border"
                      aria-label={`Filter by ${service} service`}
                    />
                    <span className="text-sm text-foreground">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Age Groups Filter */}
          {allAgeGroups.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Age Groups Served</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {allAgeGroups.map(ageGroup => (
                  <label
                    key={ageGroup}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.ageGroups.includes(ageGroup)}
                      onChange={() => toggleAgeGroup(ageGroup)}
                      className="rounded border-border"
                      aria-label={`Filter by ${ageGroup} age group`}
                    />
                    <span className="text-sm text-foreground">{ageGroup}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Filter */}
          {allCertifications.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Certifications</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {allCertifications.map(cert => (
                  <label
                    key={cert}
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.certifications.includes(cert)}
                      onChange={() => toggleCertification(cert)}
                      className="rounded border-border"
                      aria-label={`Filter by ${cert} certification`}
                    />
                    <span className="text-sm text-foreground">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Minimum Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Rating: {filters.minRating > 0 ? filters.minRating.toFixed(1) : 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={filters.minRating}
              onChange={(e) => onFiltersChange({ ...filters, minRating: parseFloat(e.target.value) })}
              className="w-full"
              aria-label="Minimum rating filter"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>5</span>
            </div>
          </div>

          {/* Minimum Experience */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Experience: {filters.minExperience > 0 ? `${filters.minExperience} years` : 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={filters.minExperience}
              onChange={(e) => onFiltersChange({ ...filters, minExperience: parseInt(e.target.value) })}
              className="w-full"
              aria-label="Minimum years of experience filter"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 years</span>
              <span>20+ years</span>
            </div>
          </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
