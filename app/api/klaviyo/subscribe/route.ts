import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get Klaviyo API key from environment variables
    const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY
    const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID

    if (!KLAVIYO_API_KEY) {
      console.error('Klaviyo API key not configured')
      // In development, just log the subscription
      console.log('Subscription (dev mode):', { email, name, source })
      return NextResponse.json({ 
        success: true,
        message: 'Subscription logged (Klaviyo not configured)'
      })
    }

    // Klaviyo API endpoint for subscribing to a list
    const klaviyoUrl = `https://a.klaviyo.com/api/v2/list/${KLAVIYO_LIST_ID}/subscribe`

    const response = await fetch(klaviyoUrl, {
      method: 'POST',
      headers: {
        'api-key': KLAVIYO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profiles: [{
          email: email,
          first_name: name?.split(' ')[0] || '',
          last_name: name?.split(' ').slice(1).join(' ') || '',
          properties: {
            source: source || 'website',
            subscribed_at: new Date().toISOString(),
          }
        }]
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Klaviyo API error:', errorText)
      throw new Error('Failed to subscribe to Klaviyo')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to Klaviyo'
    })
  } catch (error) {
    console.error('Error subscribing to Klaviyo:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
