import { Provider } from '@/types/provider'
import { setProvidersData } from './data'

// Load providers from JSON file (for initial data)
export async function loadProvidersFromJSON(): Promise<void> {
  try {
    // In production, you might fetch from an API or database
    // For now, we'll use the API endpoint
    const response = await fetch('/api/providers')
    if (response.ok) {
      const data = await response.json()
      setProvidersData(data.providers || [])
    }
  } catch (error) {
    console.error('Error loading providers:', error)
    // Fallback to empty array
    setProvidersData([])
  }
}

// Initialize data on server side
export function initializeProvidersData(providers: Provider[]): void {
  setProvidersData(providers)
}
