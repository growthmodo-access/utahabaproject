export interface Provider {
  id: string
  name: string
  county: string
  city?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  services?: string[]
  rating?: number
  rank?: number
  yearsExperience?: number
  certifications?: string[]
  insuranceAccepted?: string[]
  ageGroups?: string[]
  [key: string]: any // For additional Excel columns
}

export interface CountyData {
  county: string
  providers: Provider[]
}
