'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
type Consultation = {
  id: string
  date: string
  poids?: number | null
  taille?: number | null
  perimetreCranien?: number | null
}

type Props = {
  consultations: Consultation[]
}

const PRIMARY = '#0F766E'
const LIGHT_GRID = '#E7E5E4'
const LIGHT_TEXT = '#A8A29E'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

type DataPoint = {
  date: string
  rawDate: string
  poids?: number | null
  taille?: number | null
  pc?: number | null
}

export default function GrowthChart({ consultations }: Props) {
  const points: DataPoint[] = consultations
    .filter((c) => c.poids || c.taille || c.perimetreCranien)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((c) => ({
      date: formatDate(c.date),
      rawDate: c.date,
      poids: c.poids,
      taille: c.taille,
      pc: c.perimetreCranien,
    }))

  const hasPoids = points.some((p) => p.poids != null)
  const hasTaille = points.some((p) => p.taille != null)
  const hasPc = points.some((p) => p.pc != null)

  if (points.length < 2) {
    return (
      <div className="mb-8">
        <h3 className="mb-2 font-heading text-lg font-semibold text-stone-800">
          Courbes de croissance
        </h3>
        <p className="text-sm text-stone-400">
          Pas encore assez de données pour une courbe de croissance.
        </p>
      </div>
    )
  }

  const chartProps = {
    data: points,
    margin: { top: 4, right: 4, bottom: 0, left: 0 },
  }

  return (
    <div className="mb-8">
      <h3 className="mb-3 font-heading text-lg font-semibold text-stone-800">
        Courbes de croissance
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {hasPoids && (
          <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
            <p className="mb-1 text-xs font-medium text-stone-500">Poids (kg)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart {...chartProps}>
                <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: LIGHT_TEXT }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: LIGHT_TEXT }} width={32} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E7E5E4' }}
                  labelFormatter={() => ''}
                />
                <Line type="monotone" dataKey="poids" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {hasTaille && (
          <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
            <p className="mb-1 text-xs font-medium text-stone-500">Taille (cm)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart {...chartProps}>
                <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: LIGHT_TEXT }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: LIGHT_TEXT }} width={32} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E7E5E4' }}
                  labelFormatter={() => ''}
                />
                <Line type="monotone" dataKey="taille" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {hasPc && (
          <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
            <p className="mb-1 text-xs font-medium text-stone-500">Périmètre crânien (cm)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart {...chartProps}>
                <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: LIGHT_TEXT }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: LIGHT_TEXT }} width={32} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E7E5E4' }}
                  labelFormatter={() => ''}
                />
                <Line type="monotone" dataKey="pc" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
