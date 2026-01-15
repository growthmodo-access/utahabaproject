'use client'

import { useState, useEffect, useMemo } from 'react'
import { Provider } from '@/types/provider'
import { FilterOptions, SortOption } from '@/types/filter'
import ProviderCard from '@/components/ProviderCard'
import ProviderRow from '@/components/ProviderRow'
import ProviderRowSkeleton from '@/components/ProviderRowSkeleton'
import FilterPanel from '@/components/FilterPanel'
import EmptyState from '@/components/EmptyState'
import { MapPin, Search, ArrowUpDown } from 'lucide-react'
import { filterProviders, sortProviders } from '@/lib/client-utils'
import { useDebounce } from '@/lib/useDebounce'

export default function DirectoryPage() {
  const [selectedCounty, setSelectedCounty] = useState<string>('')
  const [providers, setProviders] = useState<Provider[]>([])
  const [counties, setCounties] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    insurance: [],
    services: [],
    ageGroups: [],
    minRating: 0,
    certifications: [],
    minExperience: 0,
  })
  const [sortOption, setSortOption] = useState<SortOption>('rank-asc')

  useEffect(() => {
    setLoading(true)
    // Fetch providers data
    fetch('/api/providers')
      .then(res => res.json())
      .then(data => {
        const allCounties = Array.from(new Set(data.providers.map((p: Provider) => p.county).filter(Boolean))).sort() as string[]
        setCounties(allCounties)
        
        if (selectedCounty) {
          const filtered = data.providers
            .filter((p: Provider) => p.county?.toLowerCase() === selectedCounty.toLowerCase())
          setProviders(filtered)
        } else {
          setProviders(data.providers)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching providers:', err)
        setLoading(false)
      })
  }, [selectedCounty])

  // Apply search, filters, and sorting
  const processedProviders = useMemo(() => {
    let result = [...providers]

    // Apply search (using debounced value)
    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase()
      result = result.filter(p => 
        p.name?.toLowerCase().includes(search) ||
        p.county?.toLowerCase().includes(search) ||
        p.city?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.services?.some(s => s.toLowerCase().includes(search)) ||
        p.certifications?.some(c => c.toLowerCase().includes(search))
      )
    }

    // Apply filters
    result = filterProviders(result, filters)

    // Apply sorting
    result = sortProviders(result, sortOption)

    return result
  }, [providers, debouncedSearchTerm, filters, sortOption])

  const groupedByCounty = useMemo(() => {
    return processedProviders.reduce((acc, provider) => {
      const county = provider.county || 'Unknown'
      if (!acc[county]) acc[county] = []
      acc[county].push(provider)
      return acc
    }, {} as Record<string, Provider[]>)
  }, [processedProviders])

  const clearFilters = () => {
    setFilters({
      insurance: [],
      services: [],
      ageGroups: [],
      minRating: 0,
      certifications: [],
      minExperience: 0,
    })
  }

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <main id="main-content" className="max-w-7xl mx-auto" role="main">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            ABA Therapy Providers in Utah
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Find the top 8 providers in each Utah county
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
                Search Providers
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, location, or services..."
                  className="w-full border border-border rounded-lg px-3 sm:px-4 py-2 pl-9 sm:pl-10 text-sm sm:text-base focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                  aria-label="Search providers"
                />
              </div>
            </div>
            <div>
              <label htmlFor="county-filter" className="block text-sm font-medium text-foreground mb-2">
                Filter by County
              </label>
              <select
                id="county-filter"
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
                className="w-full border border-border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                aria-label="Filter by county"
              >
                <option value="">All Counties</option>
                {counties.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-foreground mb-2">
                Sort By
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full border border-border rounded-lg px-3 sm:px-4 py-2 pr-9 text-sm sm:text-base focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background appearance-none"
                  aria-label="Sort providers"
                >
                  <option value="rank-asc">Rank (Low to High)</option>
                  <option value="rank-desc">Rank (High to Low)</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="rating-asc">Lowest Rated</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="experience-desc">Most Experienced</option>
                  <option value="experience-asc">Least Experienced</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" aria-hidden="true" />
              </div>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <div className="mt-4 pt-4 border-t border-border">
            <FilterPanel
              providers={providers}
              filters={filters}
              onFiltersChange={setFilters}
              onClear={clearFilters}
            />
          </div>
        </div>

        {/* Results Count */}
        {!loading && processedProviders.length > 0 && (
          <div className="mb-4 text-sm text-muted-foreground" aria-live="polite">
            Showing {processedProviders.length} provider{processedProviders.length !== 1 ? 's' : ''}
            {selectedCounty && ` in ${selectedCounty} County`}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 sm:space-y-6">
            {[...Array(8)].map((_, i) => (
              <ProviderRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Providers List */}
        {!loading && selectedCounty ? (
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/60" aria-hidden="true" />
              Top Providers in {selectedCounty} County
            </h2>
            {processedProviders.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {processedProviders.map((provider, index) => (
                  <ProviderRow 
                    key={provider.id} 
                    provider={provider} 
                    rank={index + 1}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                type="no-results"
                onAction={clearFilters}
              />
            )}
          </div>
        ) : !loading && (
          <div className="space-y-8 sm:space-y-12">
            {Object.keys(groupedByCounty).length > 0 ? (
              Object.entries(groupedByCounty).map(([county, countyProviders]) => (
                <div key={county}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/60" aria-hidden="true" />
                    {county} County - Top Providers
                    <span className="text-base sm:text-lg font-normal text-muted-foreground ml-2">
                      ({countyProviders.length})
                    </span>
                  </h2>
                  {countyProviders.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {countyProviders.slice(0, 8).map((provider, index) => (
                        <ProviderRow 
                          key={provider.id} 
                          provider={provider} 
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState type="no-county" />
                  )}
                </div>
              ))
            ) : (
              <EmptyState
                type="no-providers"
                message="No providers match your search criteria. Try adjusting your filters or search terms."
                onAction={() => {
                  setSearchTerm('')
                  clearFilters()
                  setSelectedCounty('')
                }}
                actionLabel="Clear All"
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
