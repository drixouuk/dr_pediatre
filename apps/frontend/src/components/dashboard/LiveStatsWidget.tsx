import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { Link } from '@/i18n/navigation'
import { Users, Calendar, ClockArrowDown, CheckCheck } from 'lucide-react'

type StatCard = {
  label: string
  count: number
  icon: React.ReactNode
  color: string
}

type Props = {
  clickable?: boolean
}

export default async function LiveStatsWidget({ clickable }: Props) {
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
    { label: 'Programmés', count: scheduled?.totalDocs ?? 0, icon: <Calendar className="size-5" />, color: 'text-primary-600 bg-primary-50' },
    { label: 'Salle d\'attente', count: waiting?.totalDocs ?? 0, icon: <Users className="size-5" />, color: 'text-primary-700 bg-primary-50' },
    { label: 'En consultation', count: inConsultation?.totalDocs ?? 0, icon: <ClockArrowDown className="size-5" />, color: 'text-primary-700 bg-primary-50' },
    { label: 'Terminés aujourd\'hui', count: completed?.totalDocs ?? 0, icon: <CheckCheck className="size-5" />, color: 'text-primary-600 bg-primary-50' },
  ]

  const inner = (card: StatCard) => (
    <div
      key={card.label}
      className={`rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-shadow duration-200 ${
        clickable ? 'cursor-pointer hover:shadow-md hover:border-primary-200' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-500">{card.label}</span>
        <span className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}>
          {card.icon}
        </span>
      </div>
      <p className="mt-2 font-heading text-3xl font-bold text-stone-800">{card.count}</p>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) =>
        clickable ? (
          <Link key={card.label} href="/dashboard/queue">
            {inner(card)}
          </Link>
        ) : (
          inner(card)
        ),
      )}
    </div>
  )
}
