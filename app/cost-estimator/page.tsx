'use client'

import { useState } from 'react'
import { Calculator, DollarSign, Clock, Users, TrendingUp, Info, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import EmailCapture from '@/components/EmailCapture'
import Link from 'next/link'

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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-16 pt-16 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white to-gray-50/90" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400/10 to-green-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-green-100 border border-green-200 mb-6 sm:mb-8 shadow-sm">
            <Calculator className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Cost Calculator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
            ABA Therapy
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-foreground via-green-600/20 to-foreground bg-clip-text text-transparent">
              Cost Estimator
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto px-4 leading-relaxed font-light">
            Get a personalized estimate for ABA therapy costs in Utah based on your specific needs
          </p>
        </div>
      </section>

      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white">
        <div className="max-w-5xl mx-auto">

        <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 md:p-10 mb-8 sm:mb-12">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Your Information</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Fill in the details below to get an accurate estimate</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); calculateEstimate(); }}>
            <div className="space-y-6 sm:space-y-8">
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
                className="w-full bg-foreground text-background py-4 px-6 rounded-xl font-semibold hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Calculator className="w-5 h-5 inline-block mr-2" />
                Calculate Estimate
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 md:p-10 mb-8 sm:mb-12">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Your Estimated Costs</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Based on your input, here&apos;s what you can expect</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">Weekly</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  ${result.weeklyCost.toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {result.weeklyHours} hours @ ${result.hourlyRate}/hr
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">Monthly</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  ${result.monthlyCost.toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Average monthly cost</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">Yearly</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  ${result.yearlyCost.toFixed(0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Annual estimate</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-blue-900 mb-1">Insurance Coverage</h4>
                    <p className="text-xs text-blue-800">
                      {insurance === 'yes' 
                        ? 'With insurance, you typically pay 20% of the total cost. Most Utah insurance plans cover 70-90% of ABA therapy.'
                        : 'Self-pay rates may be higher. Consider checking with providers about payment plans or financial assistance.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-green-900 mb-1">Next Steps</h4>
                    <p className="text-xs text-green-800">
                      Contact providers directly to verify insurance coverage and get exact pricing. Use our <Link href="/directory" className="underline font-medium">provider directory</Link> to find providers in your area.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-yellow-900 mb-1">Important Note</h4>
                  <p className="text-xs text-yellow-800">
                    These are estimates based on average rates in Utah. Actual costs may vary based on provider, insurance coverage details, individual needs, and location. Always contact providers directly for accurate pricing and to verify your insurance benefits.
                  </p>
                </div>
              </div>
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

        <div className="bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">Understanding ABA Therapy Costs</h2>
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              ABA therapy costs can vary significantly based on several factors. Understanding these factors can help you make informed decisions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <p className="text-sm text-muted-foreground">Urban areas like Salt Lake City may have higher rates than rural areas.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Provider Experience
                  </h3>
                  <p className="text-sm text-muted-foreground">Board-certified behavior analysts (BCBAs) typically charge more but provide higher quality care.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Intensity
                  </h3>
                  <p className="text-sm text-muted-foreground">More hours per week = higher total cost, but may lead to better outcomes.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Insurance Coverage
                  </h3>
                  <p className="text-sm text-muted-foreground">Most insurance plans cover 70-90% of ABA therapy costs. Utah law requires certain plans to cover ABA for autism.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Age
                  </h3>
                  <p className="text-sm text-muted-foreground">Early intervention (ages 2-5) often has better insurance coverage and can be more cost-effective long-term.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Service Type
                  </h3>
                  <p className="text-sm text-muted-foreground">In-home, clinic-based, and school-based services may have different rates.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">Tips for Managing Costs</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Verify your insurance coverage and benefits before starting therapy</li>
                <li>Ask providers about payment plans or financial assistance programs</li>
                <li>Consider starting with fewer hours and increasing as needed</li>
                <li>Look for providers that accept your insurance to minimize out-of-pocket costs</li>
                <li>Some providers offer sliding scale fees based on income</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
