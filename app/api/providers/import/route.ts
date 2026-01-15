import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { setProvidersData } from '@/lib/data'
import { Provider } from '@/types/provider'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    // Transform Excel data to Provider format
    const providers: Provider[] = data.map((row: any, index: number) => {
      // Generate ID if not present
      const id = row.id || row.ID || `provider-${index + 1}`
      
      return {
        id: String(id),
        name: row.name || row.Name || row['Provider Name'] || 'Unknown Provider',
        county: row.county || row.County || '',
        city: row.city || row.City || '',
        address: row.address || row.Address || '',
        phone: row.phone || row.Phone || row['Phone Number'] || '',
        email: row.email || row.Email || '',
        website: row.website || row.Website || row['Web Site'] || '',
        description: row.description || row.Description || '',
        services: row.services ? (Array.isArray(row.services) ? row.services : row.services.split(',').map((s: string) => s.trim())) : [],
        rating: row.rating || row.Rating ? parseFloat(row.rating || row.Rating) : undefined,
        rank: row.rank || row.Rank ? parseInt(row.rank || row.Rank) : undefined,
        yearsExperience: row.yearsExperience || row['Years Experience'] ? parseInt(row.yearsExperience || row['Years Experience']) : undefined,
        certifications: row.certifications ? (Array.isArray(row.certifications) ? row.certifications : row.certifications.split(',').map((c: string) => c.trim())) : [],
        insuranceAccepted: row.insuranceAccepted || row['Insurance Accepted'] ? (Array.isArray(row.insuranceAccepted || row['Insurance Accepted']) ? row.insuranceAccepted || row['Insurance Accepted'] : (row.insuranceAccepted || row['Insurance Accepted']).split(',').map((i: string) => i.trim())) : [],
        ageGroups: row.ageGroups || row['Age Groups'] ? (Array.isArray(row.ageGroups || row['Age Groups']) ? row.ageGroups || row['Age Groups'] : (row.ageGroups || row['Age Groups']).split(',').map((a: string) => a.trim())) : [],
        ...row // Include any additional columns
      }
    })

    setProvidersData(providers)

    return NextResponse.json({ 
      success: true,
      count: providers.length,
      message: `Successfully imported ${providers.length} providers`
    })
  } catch (error) {
    console.error('Error importing providers:', error)
    return NextResponse.json(
      { error: 'Failed to import providers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
