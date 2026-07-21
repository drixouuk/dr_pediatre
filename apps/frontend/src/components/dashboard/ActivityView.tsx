'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { UserPlus, Stethoscope } from 'lucide-react'

type Props = {
  period: 'day' | 'week' | 'month' | 'year'
  newPatients: number
  consultationsDone: number
  chartData: { date: string; consultations: number; newPatients: number }[]
}

const PRIMARY = '#0F766E'
const PRIMARY_LIGHT = '#99F6E4'
const LIGHT_GRID = '#E7E5E4'
const LIGHT_TEXT = '#A8A29E'

export default function ActivityView({
  period,
  newPatients,
  consultationsDone,
  chartData,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setPeriod = (p: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('period', p)
    router.push(`?${params.toString()}`)
  }

  const periods = [
    { value: 'day', label: 'Jour' },
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' },
  ]

  const hasData = chartData.some((d) => d.consultations > 0 || d.newPatients > 0)

  return (
    <div>
      <div className="mb-6 inline-flex rounded-lg bg-stone-100 p-0.5">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              period === p.value ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <UserPlus className="size-5" />
            </span>
            <div>
              <p className="font-heading text-3xl font-bold text-stone-800">{newPatients}</p>
              <p className="text-sm text-stone-500">Nouveaux patients</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <Stethoscope className="size-5" />
            </span>
            <div>
              <p className="font-heading text-3xl font-bold text-stone-800">{consultationsDone}</p>
              <p className="text-sm text-stone-500">Consultations réalisées</p>
            </div>
          </div>
        </div>
      </div>

      {!hasData && (
        <p className="text-sm text-stone-400">Aucune donnée pour cette période</p>
      )}

      {hasData && (
        <div className="mb-6">
          <h3 className="mb-2 font-heading text-sm font-semibold text-stone-700">Consultations par jour</h3>
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: LIGHT_TEXT }} />
                <YAxis tick={{ fontSize: 11, fill: LIGHT_TEXT }} width={30} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${LIGHT_GRID}` }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="consultations" name="Consultations" fill={PRIMARY} radius={[4, 4, 0, 0]} />
                <Bar dataKey="newPatients" name="Nouveaux patients" fill={PRIMARY_LIGHT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
