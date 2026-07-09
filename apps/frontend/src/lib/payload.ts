const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://dr-pediatre-cms.vercel.app'

async function fetchAPI<T>(path: string, tags: string[], locale?: string): Promise<T | null> {
  try {
    const url = new URL(path.startsWith('http') ? path : `${CMS_URL}${path}`)
    if (locale) url.searchParams.set('locale', locale)
    url.searchParams.set('depth', '1')

    const res = await fetch(url.toString(), {
      next: { tags, revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.docs ?? json
  } catch {
    return null
  }
}

export type PracticeInfo = {
  id: string
  address: string
  city: string
  phone: string
  email: string
  coordinates: { lat: number; lng: number }
  schedules: { day: string; open: string; close: string }[]
  pricing: unknown
}

export type Service = {
  id: string
  title: string
  description: unknown
  icon: string
  order: number
}

export type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
  source: 'google' | 'direct'
  published: boolean
}

export type Doctor = {
  id: string
  name: string
  slug: string
  specialty: string
  bio: unknown
  rpps: string
  languages: { language: string }[]
}

export type CalComSettings = {
  eventSlug: string | null
  username: string | null
  customUrl: string | null
}

export type Tenant = {
  id: string
  name: string
  domain: string
  settings: {
    defaultLocale: string
    activeTier: string
  }
  calcomSettings: CalComSettings | null
}

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  const data = await fetchAPI<Tenant[]>(
    `/api/tenants?where[domain][equals]=${encodeURIComponent(domain)}&limit=1`,
    [`tenant-domain-${domain}`],
  )
  return data?.[0] ?? null
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const data = await fetchAPI<Tenant>(`/api/tenants/${id}`, [`tenant-${id}`])
  return data ?? null
}

export async function getPracticeInfo(tenantId: string, locale: string): Promise<PracticeInfo | null> {
  const data = await fetchAPI<PracticeInfo[]>(
    `/api/practice-info?where[tenant][equals]=${tenantId}&limit=1`,
    [`tenant-${tenantId}`, 'practice-info'],
    locale,
  )
  return data?.[0] ?? null
}

export async function getServices(tenantId: string, locale: string): Promise<Service[]> {
  const data = await fetchAPI<Service[]>('/api/services', [`tenant-${tenantId}`, 'services'], locale)
  return data ?? []
}

export async function getReviews(tenantId: string, locale: string): Promise<Review[]> {
  const data = await fetchAPI<Review[]>('/api/reviews', [`tenant-${tenantId}`, 'reviews', 'published'], locale)
  return data ?? []
}

export async function getDoctorProfile(tenantId: string, locale: string): Promise<Doctor | null> {
  const data = await fetchAPI<Doctor[]>('/api/doctors?limit=1', [`tenant-${tenantId}`, 'doctor'], locale)
  return data?.[0] ?? null
}
