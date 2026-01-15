import { Provider } from '@/types/provider'
import { FilterOptions, SortOption } from '@/types/filter'

// Client-side filter and sort functions (can be used in browser)

// Filter providers based on filter options
export function filterProviders(providers: Provider[], filters: FilterOptions): Provider[] {
  return providers.filter(provider => {
    // Insurance filter
    if (filters.insurance.length > 0) {
      const providerInsurance = provider.insuranceAccepted || []
      const hasMatchingInsurance = filters.insurance.some(ins => 
        providerInsurance.some(pIns => pIns.toLowerCase().includes(ins.toLowerCase()))
      )
      if (!hasMatchingInsurance) return false
    }

    // Services filter
    if (filters.services.length > 0) {
      const providerServices = provider.services || []
      const hasMatchingService = filters.services.some(service => 
        providerServices.some(pService => pService.toLowerCase().includes(service.toLowerCase()))
      )
      if (!hasMatchingService) return false
    }

    // Age groups filter
    if (filters.ageGroups.length > 0) {
      const providerAgeGroups = provider.ageGroups || []
      const hasMatchingAgeGroup = filters.ageGroups.some(ageGroup => 
        providerAgeGroups.some(pAge => pAge.toLowerCase().includes(ageGroup.toLowerCase()))
      )
      if (!hasMatchingAgeGroup) return false
    }

    // Certifications filter
    if (filters.certifications.length > 0) {
      const providerCerts = provider.certifications || []
      const hasMatchingCert = filters.certifications.some(cert => 
        providerCerts.some(pCert => pCert.toLowerCase().includes(cert.toLowerCase()))
      )
      if (!hasMatchingCert) return false
    }

    // Minimum rating filter
    if (filters.minRating > 0) {
      if (!provider.rating || provider.rating < filters.minRating) return false
    }

    // Minimum experience filter
    if (filters.minExperience > 0) {
      if (!provider.yearsExperience || provider.yearsExperience < filters.minExperience) return false
    }

    return true
  })
}

// Sort providers based on sort option
export function sortProviders(providers: Provider[], sortOption: SortOption): Provider[] {
  const sorted = [...providers]

  switch (sortOption) {
    case 'recommended':
      // Put Golden Touch ABA first, then sort by rank/rating
      return sorted.sort((a, b) => {
        const aIsGoldenTouch = a.name?.toLowerCase().includes('golden touch') || false
        const bIsGoldenTouch = b.name?.toLowerCase().includes('golden touch') || false
        
        // Golden Touch ABA always comes first
        if (aIsGoldenTouch && !bIsGoldenTouch) return -1
        if (!aIsGoldenTouch && bIsGoldenTouch) return 1
        
        // For others, sort by rank first, then rating
        if (a.rank && b.rank) return a.rank - b.rank
        if (a.rank) return -1
        if (b.rank) return 1
        if (a.rating && b.rating) return b.rating - a.rating
        if (a.rating) return -1
        if (b.rating) return 1
        return a.name.localeCompare(b.name)
      })
    
    case 'rating-desc':
      return sorted.sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        return ratingB - ratingA
      })
    
    case 'rating-asc':
      return sorted.sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        return ratingA - ratingB
      })
    
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    
    case 'experience-desc':
      return sorted.sort((a, b) => {
        const expA = a.yearsExperience || 0
        const expB = b.yearsExperience || 0
        return expB - expA
      })
    
    case 'experience-asc':
      return sorted.sort((a, b) => {
        const expA = a.yearsExperience || 0
        const expB = b.yearsExperience || 0
        return expA - expB
      })
    
    case 'rank-asc':
      return sorted.sort((a, b) => {
        const rankA = a.rank || 999
        const rankB = b.rank || 999
        return rankA - rankB
      })
    
    case 'rank-desc':
      return sorted.sort((a, b) => {
        const rankA = a.rank || 999
        const rankB = b.rank || 999
        return rankB - rankA
      })
    
    default:
      return sorted
  }
}
