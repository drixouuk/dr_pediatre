import { requireAuth } from '@/lib/auth'
import { getTenantById } from '@/lib/payload'
import { fetchCalBookings, healthCheckCalcom } from '@/lib/calcom-api'
import type { CalBooking } from '@/lib/calcom-api'
import { AlertTriangle, Info } from 'lucide-react'
import BookingListView from '@/components/dashboard/BookingListView'

function startOfDay(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function nowISO(): string {
  return new Date().toISOString()
}

function formatDateTitle(): string {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function RendezVousPage() {
  const user = await requireAuth()
  const tenantId = typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant
  const tenant = tenantId ? await getTenantById(tenantId) : null

  const calcomSettings = tenant?.calcomSettings
  const apiKey = process.env.CALCOM_API_KEY
  const baseUrl = calcomSettings?.customUrl || 'https://calcom.drixou.uk'

  const noConfig = !calcomSettings?.username || !calcomSettings?.eventSlug || !apiKey

  if (noConfig) {
    return (
      <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold text-stone-800">Rendez-vous</h1>
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="size-5 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-heading text-base font-semibold text-stone-800">Calendrier non configuré</h2>
              <p className="mt-1 text-sm text-stone-500">
                Pour activer la prise de rendez-vous en ligne, configurez votre compte Cal.com dans les paramètres du cabinet.
              </p>
              <a
                href="mailto:contact@dr-tabibi.ma"
                className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Contacter le support
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const apiHealthy = await healthCheckCalcom(baseUrl, apiKey!)

  if (!apiHealthy) {
    return (
      <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold text-stone-800">Rendez-vous</h1>
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h2 className="font-heading text-base font-semibold text-stone-800">Service indisponible</h2>
              <p className="mt-1 text-sm text-stone-500">
                Impossible de contacter Cal.com. Vérifiez la configuration ou réessayez plus tard.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const todayStart = startOfDay()
  const now = nowISO()

  let upcoming: CalBooking[] = []
  let completed: CalBooking[] = []

  try {
    const [upcomingRes, todayRes] = await Promise.all([
      fetchCalBookings({ baseUrl, apiKey: apiKey!, status: 'upcoming', afterStart: todayStart, sortStart: 'asc', limit: 50 }),
      fetchCalBookings({ baseUrl, apiKey: apiKey!, afterStart: todayStart, sortStart: 'asc', limit: 50 }),
    ])

    const allToday = [...(upcomingRes.data || []), ...(todayRes.data || [])]
    const seen = new Set<number>()
    const deduped: CalBooking[] = []

    for (const b of allToday) {
      if (!seen.has(b.id)) {
        seen.add(b.id)
        deduped.push(b)
      }
    }

    upcoming = deduped.filter((b) => b.status !== 'cancelled' && b.status !== 'rejected' && b.end >= now)
    completed = deduped.filter((b) => b.end < now)
  } catch {
    upcoming = []
    completed = []
  }

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-stone-800">Rendez-vous</h1>
        <p className="mt-1 text-sm text-stone-500 capitalize">{formatDateTitle()}</p>
      </div>
      <BookingListView upcoming={upcoming} past={completed} />
    </div>
  )
}
