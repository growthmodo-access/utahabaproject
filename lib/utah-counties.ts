/**
 * Official list of Utah's 29 counties (names without "County" suffix).
 * Used to ensure only real counties appear in the directory filter.
 */
export const UTAH_COUNTIES = [
  'Beaver',
  'Box Elder',
  'Cache',
  'Carbon',
  'Daggett',
  'Davis',
  'Duchesne',
  'Emery',
  'Garfield',
  'Grand',
  'Iron',
  'Juab',
  'Kane',
  'Millard',
  'Morgan',
  'Piute',
  'Rich',
  'Salt Lake',
  'San Juan',
  'Sanpete',
  'Sevier',
  'Summit',
  'Tooele',
  'Uintah',
  'Utah',
  'Wasatch',
  'Washington',
  'Wayne',
  'Weber',
] as const

export type UtahCounty = (typeof UTAH_COUNTIES)[number]

const COUNTY_SET = new Set(UTAH_COUNTIES.map((c) => c.toLowerCase()))

/** Cities/regions that appear in provider data mapped to their Utah county */
const CITY_OR_REGION_TO_COUNTY: Record<string, UtahCounty> = {
  'salt lake city': 'Salt Lake',
  'sandy': 'Salt Lake',
  'draper': 'Salt Lake',
  'south jordan': 'Salt Lake',
  'cottonwood heights': 'Salt Lake',
  'bountiful': 'Davis',
  'lehi': 'Utah',
  'orem': 'Utah',
  'saratoga springs': 'Utah',
  'spanish fork': 'Utah',
  'smithfield': 'Cache',
  'logan': 'Cache',
  'richfield': 'Sevier',
  'saint george': 'Washington',
  'st. george': 'Washington',
  'st george': 'Washington',
  'cedar city': 'Iron',
  'ogden': 'Weber',
}

/**
 * Returns true if the given string is an official Utah county name.
 */
export function isUtahCounty(name: string | null | undefined): boolean {
  if (!name || typeof name !== 'string') return false
  return COUNTY_SET.has(name.trim().toLowerCase())
}

/**
 * Normalizes a provider's county field (which may be a city, region, or phrase)
 * to an official Utah county name, or null if it can't be mapped (e.g. "Statewide").
 */
export function normalizeCountyToUtahCounty(raw: string | null | undefined): UtahCounty | null {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  const lower = trimmed.toLowerCase()

  // Exact county match
  if (COUNTY_SET.has(lower)) {
    const found = UTAH_COUNTIES.find((c) => c.toLowerCase() === lower)
    return found ?? null
  }

  // "Weber (limited)" -> Weber, "Salt Lake City & surrounding" -> Salt Lake
  if (lower.includes('weber')) return 'Weber'
  if (lower.includes('salt lake city') || lower.includes('salt lake')) return 'Salt Lake'
  if (lower.includes('st. george') || lower.includes('washington county')) return 'Washington'
  if (lower.includes('juab')) return 'Juab'
  if (lower.includes('statewide') || lower.includes('most of utah') || lower.includes('multiple locations') || lower.includes('utah and surrounding') || lower.includes('parts of utah') || lower.includes('in-home')) return null

  // City/region lookup
  const mapped = CITY_OR_REGION_TO_COUNTY[lower]
  if (mapped) return mapped

  // "Logan to Spanish Fork" etc. - could map to Utah or Cache; skip to avoid wrong assignment
  return null
}

/**
 * Returns only the Utah county names that appear in the given list of raw county strings.
 * Used to build the directory dropdown so it only shows real counties.
 */
export function getValidCountiesFromProviderList(rawCounties: (string | null | undefined)[]): string[] {
  const normalized = new Set<string>()
  for (const raw of rawCounties) {
    const county = normalizeCountyToUtahCounty(raw)
    if (county) normalized.add(county)
  }
  return UTAH_COUNTIES.filter((c) => normalized.has(c))
}
