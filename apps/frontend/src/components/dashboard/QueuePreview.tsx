import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock } from 'lucide-react'
import { computeAge } from '@/lib/age'

type QueueItem = {
  id: string
  status: string
  visitReason: string
  arrivalTime: string | null
  patient: { id: string; fullName: string; gender?: string; birthDate?: string }
}

export default async function QueuePreview() {
  const user = await requireAuth()
  const tenantId = typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant

  const data = await fetchCMS<{ docs: QueueItem[] }>(
    `/api/queue-items?where[tenant][equals]=${tenantId}&where[status][in]=waiting&where[status][in]=in_consultation&sort=arrivalTime&depth=1&limit=5`,
    { revalidate: 0 },
  )
  const items = data?.docs ?? []

  const statusLabels: Record<string, string> = { waiting: 'Salle d\'attente', in_consultation: 'En consultation' }

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <h2 className="font-heading text-lg font-semibold text-stone-800">En attente</h2>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-stone-400">Aucun patient en attente</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {items.map((item) => {
            const p = item.patient
            const initial = p?.fullName?.charAt(0)?.toUpperCase() || '?'
            const girl = p?.gender === 'girl'
            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  girl ? 'border-cta/30 bg-cta/10 text-cta-600' : 'border-primary/30 bg-primary/10 text-primary-700'
                }`}>
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/dashboard/patients/${p?.id}`} className="text-sm font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200">
                    {p?.fullName || '—'}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    {p?.birthDate && <span>{computeAge(p.birthDate)}</span>}
                    <span className="inline-block rounded bg-stone-100 px-1.5 py-0.5 font-medium text-stone-700">{item.visitReason}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">
                    {item.arrivalTime && <span className="inline-flex items-center gap-0.5"><Clock className="size-3" />{new Date(item.arrivalTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === 'in_consultation' ? 'bg-primary/10 text-primary-700' : 'bg-warning/10 text-warning'
                  }`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <Link href="/dashboard/queue" className="flex items-center justify-center gap-1 border-t border-stone-100 px-4 py-2.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
        Voir toute la file d'attente <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
