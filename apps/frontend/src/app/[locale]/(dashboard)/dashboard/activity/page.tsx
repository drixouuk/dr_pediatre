import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import ActivityView from '@/components/dashboard/ActivityView'

type Props = {
  searchParams: Promise<{ period?: string }>
}

function getStartDate(period: string): Date {
  const now = new Date()
  if (period === 'day') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
  if (period === 'year') {
    return new Date(now.getFullYear(), 0, 1)
  }
  // week: start from Monday
  const day = now.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function formatISO(d: Date): string {
  return d.toISOString()
}

function formatShort(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function groupByDay<T extends Record<string, unknown>>(
  items: T[],
  dateField: keyof T,
): { date: string; count: number }[] {
  const map = new Map<string, number>()
  for (const item of items) {
    const raw = item[dateField]
    const d = new Date(raw as string)
    const key = formatShort(d)
    map.set(key, (map.get(key) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => {
      const [da, ma] = a.date.split('/').map(Number)
      const [db, mb] = b.date.split('/').map(Number)
      return da + ma * 31 - (db + mb * 31)
    })
}

type Period = 'day' | 'week' | 'month' | 'year'

function mergeChartData(
  consultations: { date: string; count: number }[],
  patients: { date: string; count: number }[],
): { date: string; consultations: number; newPatients: number }[] {
  const map = new Map<string, { consultations: number; newPatients: number }>()
  for (const c of consultations) {
    const entry = map.get(c.date) || { consultations: 0, newPatients: 0 }
    entry.consultations = c.count
    map.set(c.date, entry)
  }
  for (const p of patients) {
    const entry = map.get(p.date) || { consultations: 0, newPatients: 0 }
    entry.newPatients = p.count
    map.set(p.date, entry)
  }
  return Array.from(map.entries())
    .map(([date, vals]) => ({ date, ...vals }))
    .sort((a, b) => {
      const [da, ma] = a.date.split('/').map(Number)
      const [db, mb] = b.date.split('/').map(Number)
      return da + ma * 31 - (db + mb * 31)
    })
}

export default async function ActivityPage({ searchParams }: Props) {
  const { period: periodParam } = await searchParams
  const period: Period = (['day', 'week', 'month', 'year'] as const).includes(periodParam as any) ? (periodParam as Period) : 'week'
  const user = await requireAuth()
  const tenantId = typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant
  const startDate = getStartDate(period)
  const isoStart = formatISO(startDate)

  const [patientsData, consultationsData] = await Promise.all([
    fetchCMS<{ docs: { id: string; createdAt: string }[] }>(
      `/api/patients?where[tenant][equals]=${tenantId}&where[createdAt][greater_than_equal]=${isoStart}&limit=5000&depth=0`,
      { revalidate: 0 },
    ),
    fetchCMS<{ docs: { id: string; date: string }[] }>(
      `/api/consultations?where[tenant][equals]=${tenantId}&where[date][greater_than_equal]=${isoStart}&limit=5000&depth=0`,
      { revalidate: 0 },
    ),
  ])

  const patients = patientsData?.docs ?? []
  const consultations = consultationsData?.docs ?? []

  const consultationsByDay = groupByDay(consultations, 'date')
  const patientsByDay = groupByDay(patients, 'createdAt')
  const chartData = mergeChartData(consultationsByDay, patientsByDay)

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-stone-800">Activité</h1>
      <div className="mt-6">
        <ActivityView
          period={period}
          newPatients={patients.length}
          consultationsDone={consultations.length}
          chartData={chartData}
        />
      </div>
    </div>
  )
}
