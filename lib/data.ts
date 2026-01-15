import { Provider, CountyData } from '@/types/provider'
import { readFileSync } from 'fs'
import { join } from 'path'

// This will be populated from Excel import
let providersData: Provider[] = []
let initialized = false

// Load initial data from JSON file
function initializeData() {
  if (initialized) return
  
  try {
    const filePath = join(process.cwd(), 'data', 'providers.json')
    const fileContents = readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    providersData = data
    initialized = true
  } catch (error) {
    // File doesn't exist or can't be read - that's okay
    providersData = []
    initialized = true
  }
}

export function setProvidersData(data: Provider[]) {
  providersData = data
  initialized = true
}

export function getProvidersData(): Provider[] {
  if (!initialized) {
    initializeData()
  }
  return providersData
}

export function getProvidersByCounty(county: string): Provider[] {
  return providersData
    .filter(p => p.county?.toLowerCase() === county.toLowerCase())
    .sort((a, b) => {
      // Sort by rank if available, then by rating
      if (a.rank && b.rank) return a.rank - b.rank
      if (a.rank) return -1
      if (b.rank) return 1
      if (a.rating && b.rating) return b.rating - a.rating
      return 0
    })
    .slice(0, 8) // Top 8 providers
}

export function getAllCounties(): string[] {
  const counties = new Set<string>()
  providersData.forEach(p => {
    if (p.county) counties.add(p.county)
  })
  return Array.from(counties).sort()
}

export function getCountyData(): CountyData[] {
  const counties = getAllCounties()
  return counties.map(county => ({
    county,
    providers: getProvidersByCounty(county)
  }))
}

export function getProviderById(id: string): Provider | undefined {
  return providersData.find(p => p.id === id)
}

export function updateProviderRank(providerId: string, newRank: number) {
  const provider = providersData.find(p => p.id === providerId)
  if (provider) {
    provider.rank = newRank
  }
}
