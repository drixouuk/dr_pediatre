import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { Link } from '@/i18n/navigation'
import ImportPatientsButton from './ImportPatientsButton'
import PatientTable from './PatientTable'
import { Download } from 'lucide-react'

type Patient = {
  id: string
  fullName: string
  gender?: string | null
  birthDate?: string | null
  nationalId?: string | null
  medicalNotes?: string
  updatedAt: string
}

type Consultation = {
  id: string
  patient: string | { id: string }
  date: string
}

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function PatientsListPage({ searchParams }: Props) {
  const { q } = await searchParams
  const user = await requireAuth()
  const tenantId = getTenantId(user)

  let apiPath = `/api/patients?sort=-updatedAt&limit=50`
  if (q?.trim()) {
    const query = encodeURIComponent(q.trim())
    apiPath = `/api/patients?where[and][0][tenant][equals]=${tenantId}&where[and][1][or][0][fullName][contains]=${query}&where[and][1][or][1][nationalId][contains]=${query}&sort=-updatedAt&limit=50`
  } else {
    apiPath = `/api/patients?where[tenant][equals]=${tenantId}&sort=-updatedAt&limit=50`
  }

  const data = await fetchCMS<{ docs: Patient[] }>(apiPath, { revalidate: 0 })
  const patients = data?.docs ?? []

  const patientIds = patients.map(p => p.id)
  const lastConsultations: Record<string, string> = {}

  if (patientIds.length > 0) {
    const inParams = patientIds.map(id => `where[patient][in]=${id}`).join('&')
    const consPath = `/api/consultations?where[tenant][equals]=${tenantId}&${inParams}&sort=-date&depth=0&limit=${patientIds.length}`
    const consData = await fetchCMS<{ docs: Consultation[] }>(consPath, { revalidate: 0 })
    const consultations = consData?.docs ?? []

    for (const c of consultations) {
      const pid = typeof c.patient === 'object' ? c.patient.id : c.patient
      const existing = lastConsultations[pid]
      if (!existing || c.date > existing) {
        lastConsultations[pid] = c.date
      }
    }
  }

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-stone-800">Patients</h1>
        <Link
          href="/dashboard/patients/new"
          className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
        >
          + Nouveau patient
        </Link>
      </div>

      <form method="GET" className="mt-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Rechercher par nom ou CIN…"
            className="w-full max-w-md rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-800"
          >
            Rechercher
          </button>
          {q && (
            <Link
              href="/dashboard/patients"
              className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              Effacer
            </Link>
          )}
        </div>
      </form>

      <div className="mt-4 mb-4 flex flex-wrap items-center gap-2">
        <a
          href="/api/patients/export"
          download
          className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors duration-200 hover:bg-stone-50"
        >
          <Download className="size-4" />
          Exporter en CSV
        </a>
        <ImportPatientsButton />
      </div>

      <PatientTable patients={patients} lastConsultations={lastConsultations} q={q} />
    </div>
  )
}
