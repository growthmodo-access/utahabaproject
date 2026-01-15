export interface FilterOptions {
  insurance: string[]
  services: string[]
  ageGroups: string[]
  minRating: number
  certifications: string[]
  minExperience: number
}

export type SortOption = 
  | 'recommended'
  | 'rating-desc'
  | 'rating-asc'
  | 'name-asc'
  | 'name-desc'
  | 'experience-desc'
  | 'experience-asc'
  | 'rank-asc'
  | 'rank-desc'