import { NextResponse } from 'next/server'
import { getProvidersData, getAllCounties, setProvidersData } from '@/lib/data'
import { Provider } from '@/types/provider'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load initial data from JSON file if available
function loadInitialData(): Provider[] {
  try {
    const filePath = join(process.cwd(), 'data', 'providers.json')
    const fileContents = readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    // File doesn't exist or can't be read - that's okay
    return []
  }
}

// Initialize with data from JSON file on first load
let initialized = false
if (!initialized) {
  const initialData = loadInitialData()
  if (initialData.length > 0) {
    setProvidersData(initialData)
    initialized = true
  }
}

export async function GET() {
  try {
    const providers = getProvidersData()
    const counties = getAllCounties()
    
    return NextResponse.json({ 
      providers,
      counties,
      count: providers.length 
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}
