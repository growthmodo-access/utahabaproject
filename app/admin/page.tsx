'use client'

import { useState, useEffect } from 'react'
import { Provider } from '@/types/provider'
import { ArrowUp, ArrowDown, Save } from 'lucide-react'

export default function AdminPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedCounty, setSelectedCounty] = useState<string>('')
  const [counties, setCounties] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/providers')
      .then(res => res.json())
      .then(data => {
        const allCounties = Array.from(new Set(data.providers.map((p: Provider) => p.county).filter(Boolean))).sort() as string[]
        setCounties(allCounties)
        setProviders(data.providers)
      })
      .catch(err => console.error('Error fetching providers:', err))
  }, [])

  const updateRank = (providerId: string, newRank: number) => {
    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        return { ...p, rank: newRank }
      }
      return p
    }))
  }

  const moveUp = (provider: Provider) => {
    const currentRank = provider.rank || 999
    if (currentRank <= 1) return
    
    // Swap with provider that has rank - 1
    const otherProvider = providers.find(p => p.rank === currentRank - 1 && p.county === provider.county)
    if (otherProvider) {
      updateRank(provider.id, currentRank - 1)
      updateRank(otherProvider.id, currentRank)
    } else {
      updateRank(provider.id, currentRank - 1)
    }
  }

  const moveDown = (provider: Provider) => {
    const currentRank = provider.rank || 999
    const maxRank = Math.max(...providers.filter(p => p.county === provider.county).map(p => p.rank || 999))
    if (currentRank >= maxRank) return
    
    // Swap with provider that has rank + 1
    const otherProvider = providers.find(p => p.rank === currentRank + 1 && p.county === provider.county)
    if (otherProvider) {
      updateRank(provider.id, currentRank + 1)
      updateRank(otherProvider.id, currentRank)
    } else {
      updateRank(provider.id, currentRank + 1)
    }
  }

  const saveRanks = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const updates = providers
        .filter(p => p.rank !== undefined && p.county === selectedCounty)
        .map(p => ({
          id: p.id,
          rank: p.rank
        }))

      for (const update of updates) {
        await fetch(`/api/providers/${update.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rank: update.rank })
        })
      }

      setMessage('Ranks saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving ranks. Please try again.')
      console.error('Error saving ranks:', error)
    } finally {
      setSaving(false)
    }
  }

  const countyProviders = providers
    .filter(p => !selectedCounty || p.county === selectedCounty)
    .sort((a, b) => {
      const rankA = a.rank || 999
      const rankB = b.rank || 999
      return rankA - rankB
    })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin: Provider Ranking</h1>
          <p className="text-gray-600">Manage provider rankings by county</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select County
          </label>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Counties</option>
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    County
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countyProviders.map((provider, index) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold text-gray-900">
                        {provider.rank || index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{provider.county}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {provider.rating ? (
                        <span className="text-sm text-gray-900">{provider.rating.toFixed(1)}</span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveUp(provider)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Move up"
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => moveDown(provider)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Move down"
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedCounty && (
          <div className="mt-6">
            <button
              onClick={saveRanks}
              disabled={saving}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Rankings'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
