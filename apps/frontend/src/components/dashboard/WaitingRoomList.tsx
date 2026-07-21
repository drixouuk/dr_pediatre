'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, ArrowRight, Check } from 'lucide-react'

type Patient = {
  id: string
  fullName: string
  gender?: 'boy' | 'girl'
  birthDate?: string
}

type QueueItem = {
  id: string
  status: string
  visitReason: string
  arrivalTime: string | null
  patient: Patient
}

function computeAge(birthDate: string): string {
  const now = new Date()
  const birth = new Date(birthDate)
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()

  if (months < 1) return 'Nouveau-né'
  if (months < 24) return `${months} mois`
  const years = Math.floor(months / 12)
  return `${years} ans`
}

function visitReasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    consultation: 'Consultation',
    controle: 'Contrôle',
    vaccin: 'Vaccin',
    urgence: 'Urgence',
  }
  return labels[reason] || reason
}

const transitionMap: Record<string, string> = {
  waiting: 'in_consultation',
  in_consultation: 'completed',
}

const actionLabels: Record<string, string> = {
  waiting: 'En consultation',
  in_consultation: 'Terminer',
}

const actionIcons: Record<string, React.ReactNode> = {
  waiting: <ArrowRight className="size-4" />,
  in_consultation: <Check className="size-4" />,
}

const statusLabels: Record<string, string> = {
  waiting: 'Salle d\'attente',
  in_consultation: 'En consultation',
}

export default function WaitingRoomList() {
  const router = useRouter()
  const [items, setItems] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQueue = async () => {
    setLoading(true)
    const res = await fetch('/api/cms-proxy/queue-items?depth=1&sort=arrivalTime&where[status][in]=waiting&where[status][in]=in_consultation&limit=50')
    if (res.ok) {
      const json = await res.json()
      setItems(json.docs ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 15000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = transitionMap[currentStatus]
    if (!nextStatus) return

    const body: Record<string, string> = { status: nextStatus }
    if (nextStatus === 'waiting') {
      body.arrivalTime = new Date().toISOString()
    }

    const res = await fetch(`/api/cms-proxy/queue-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.refresh()
      fetchQueue()
    }
  }

  const activeItems = items.filter((i) => i.status === 'waiting' || i.status === 'in_consultation')

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <h2 className="font-heading text-lg font-semibold text-stone-800">File d&apos;attente en direct</h2>
        <button
          onClick={fetchQueue}
          className="text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Rafraîchir
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-stone-400">Chargement…</div>
      ) : activeItems.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-stone-400">Aucun patient en attente.</div>
      ) : (
        <div className="divide-y divide-stone-100">
          {activeItems.map((item) => {
            const patient = item.patient
            const genderColor =
              patient?.gender === 'girl'
                ? 'border-cta/30 bg-cta/10 text-cta-600'
                : 'border-primary/30 bg-primary/10 text-primary-700'

            const next = transitionMap[item.status]

            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${genderColor}`}>
                  {patient?.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-800">
                    {patient?.fullName || '—'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500">
                    {patient?.birthDate && <span>{computeAge(patient.birthDate)}</span>}
                    <span className={`inline-block rounded px-1.5 py-0.5 font-medium ${
                      item.visitReason === 'controle' ? 'bg-info/10 text-info' :
                      item.visitReason === 'vaccin' ? 'bg-secondary/10 text-secondary-700' :
                      item.visitReason === 'urgence' ? 'bg-error/10 text-error' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {visitReasonLabel(item.visitReason)}
                    </span>
                    {item.arrivalTime && (
                      <span className="inline-flex items-center gap-0.5">
                        <Clock className="size-3" />
                        {new Date(item.arrivalTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-xs font-medium sm:inline-block ${item.status === 'in_consultation' ? 'bg-primary/10 text-primary-700 border border-primary/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                  {statusLabels[item.status]}
                </span>

                {next && (
                  <button
                    onClick={() => updateStatus(item.id, item.status)}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-800"
                  >
                    {actionIcons[item.status]}
                    {actionLabels[item.status]}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
