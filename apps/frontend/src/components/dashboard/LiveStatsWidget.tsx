import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { Users, Calendar, ClockArrowDown, CheckCheck } from 'lucide-react'

type StatCard = {
  label: string
  count: number
  icon: React.ReactNode
  color: string
}

export default async function LiveStatsWidget() {
  const user = await requireAuth()
  const tenantId = typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant
  const baseWhere = `where[tenant][equals]=${tenantId}`

  const [scheduled, waiting, inConsultation, completed] = await Promise.all([
    fetchCMS<{ totalDocs: number }>(`/api/queue-items?${baseWhere}&where[status][equals]=scheduled&depth=0&limit=0`, { revalidate: 0 }),
    fetchCMS<{ totalDocs: number }>(`/api/queue-items?${baseWhere}&where[status][equals]=waiting&depth=0&limit=0`, { revalidate: 0 }),
    fetchCMS<{ totalDocs: number }>(`/api/queue-items?${baseWhere}&where[status][equals]=in_consultation&depth=0&limit=0`, { revalidate: 0 }),
    fetchCMS<{ totalDocs: number }>(`/api/queue-items?${baseWhere}&where[status][equals]=completed&depth=0&limit=0`, { revalidate: 0 }),
  ])

  const cards: StatCard[] = [
    { label: 'Programmés', count: scheduled?.totalDocs ?? 0, icon: <Calendar className="size-5" />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Salle d\'attente', count: waiting?.totalDocs ?? 0, icon: <Users className="size-5" />, color: 'text-amber-600 bg-amber-50' },
    { label: 'En consultation', count: inConsultation?.totalDocs ?? 0, icon: <ClockArrowDown className="size-5" />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Terminés aujourd\'hui', count: completed?.totalDocs ?? 0, icon: <CheckCheck className="size-5" />, color: 'text-stone-600 bg-stone-50' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">{card.label}</span>
            <span className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}>
              {card.icon}
            </span>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-stone-800">{card.count}</p>
        </div>
      ))}
    </div>
  )
}
