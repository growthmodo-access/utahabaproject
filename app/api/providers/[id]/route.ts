import { NextRequest, NextResponse } from 'next/server'
import { getProviderById, updateProviderRank } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = getProviderById(params.id)
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ provider })
  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { rank } = body
    
    if (rank !== undefined) {
      updateProviderRank(params.id, rank)
    }
    
    const provider = getProviderById(params.id)
    
    return NextResponse.json({ 
      success: true,
      provider 
    })
  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    )
  }
}
