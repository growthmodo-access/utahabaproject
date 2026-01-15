'use client'

import { useState } from 'react'
import { Calculator, DollarSign, Clock, Users } from 'lucide-react'
import EmailCapture from '@/components/EmailCapture'

interface EstimateResult {
  weeklyHours: number
  hourlyRate: number
  weeklyCost: number
  monthlyCost: number
  yearlyCost: number
}

export default function CostEstimatorPage() {
  const [age, setAge] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('')
  const [insurance, setInsurance] = useState('yes')
  const [location, setLocation] = useState('')
  const [result, setResult] = useState<EstimateResult | null>(null)
  const [showEmailCapture, setShowEmailCapture] = useState(false)

  const calculateEstimate = () => {
    const hours = parseFloat(hoursPerWeek) || 0
    if (hours <= 0) {
      alert('Please enter valid hours per week')
      return
    }

    // Base hourly rate for ABA therapy in Utah: $50-$150/hour
    // Average around $75/hour, insurance typically covers 70-90%
    let baseRate = 75
    if (location.toLowerCase().includes('salt lake') || location.toLowerCase().includes('park city')) {
      baseRate = 85 // Higher cost areas
    }

    const hourlyRate = baseRate
    const weeklyCost = hours * hourlyRate
    const monthlyCost = weeklyCost * 4.33 // Average weeks per month
    const yearlyCost = monthlyCost * 12

    // Insurance coverage adjustment
    let outOfPocketWeekly = weeklyCost
    let outOfPocketMonthly = monthlyCost
    let outOfPocketYearly = yearlyCost

    if (insurance === 'yes') {
      // Assume 80% coverage on average
      outOfPocketWeekly = weeklyCost * 0.2
      outOfPocketMonthly = monthlyCost * 0.2
      outOfPocketYearly = yearlyCost * 0.2
    }

    setResult({
      weeklyHours: hours,
      hourlyRate,
      weeklyCost: outOfPocketWeekly,
      monthlyCost: outOfPocketMonthly,
      yearlyCost: outOfPocketYearly
    })
    setShowEmailCapture(true)
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Calculator className="w-12 h-12 sm:w-16 sm:h-16 text-foreground mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            ABA Therapy Cost Estimator
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Get a personalized estimate for ABA therapy costs in Utah
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm p-5 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <form onSubmit={(e) => { e.preventDefault(); calculateEstimate(); }}>
            <div className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age of Individual
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full border border-border rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hours per Week
                </label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  placeholder="e.g., 20 (typical range: 10-40 hours)"
                  required
                  className="w-full border border-border rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                />
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                  Typical ABA therapy ranges from 10-40 hours per week
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Do you have insurance coverage?
                </label>
                <select
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                >
                  <option value="yes">Yes, I have insurance</option>
                  <option value="no">No insurance / Self-pay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Salt Lake City, Park City"
                  className="w-full border border-border rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-colors bg-background"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background py-3 px-6 rounded-lg font-medium hover:bg-foreground/90 transition-colors text-sm sm:text-base"
              >
                Calculate Estimate
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="bg-card border border-border rounded-lg shadow-sm p-5 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6">Your Estimated Costs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-accent rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">Weekly</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  ${result.weeklyCost.toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {result.weeklyHours} hours @ ${result.hourlyRate}/hr
                </p>
              </div>
              <div className="bg-accent rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">Monthly</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  ${result.monthlyCost.toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Average monthly cost</p>
              </div>
              <div className="bg-accent rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">Yearly</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  ${result.yearlyCost.toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Annual estimate</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>Note:</strong> These are estimates based on average rates in Utah. Actual costs may vary based on provider, 
                insurance coverage details, and individual needs. Contact providers directly for accurate pricing.
              </p>
            </div>
          </div>
        )}

        {showEmailCapture && (
          <div className="mb-6 sm:mb-8">
            <EmailCapture 
              source="cost-estimator"
              onSuccess={() => setShowEmailCapture(false)}
            />
          </div>
        )}

        <div className="bg-card border border-border rounded-lg shadow-sm p-5 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">Understanding ABA Therapy Costs</h2>
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              ABA therapy costs can vary significantly based on several factors:
            </p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-muted-foreground">
              <li><strong className="text-foreground">Location:</strong> Urban areas like Salt Lake City may have higher rates</li>
              <li><strong className="text-foreground">Provider Experience:</strong> Board-certified behavior analysts typically charge more</li>
              <li><strong className="text-foreground">Intensity:</strong> More hours per week = higher total cost</li>
              <li><strong className="text-foreground">Insurance Coverage:</strong> Most insurance plans cover 70-90% of ABA therapy costs</li>
              <li><strong className="text-foreground">Age:</strong> Early intervention (ages 2-5) often has better insurance coverage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
