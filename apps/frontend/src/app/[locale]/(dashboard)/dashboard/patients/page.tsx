import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { Link } from '@/i18n/navigation'
import PatientActionsDropdown from '@/components/dashboard/PatientActionsDropdown'
import ImportPatientsButton from './ImportPatientsButton'
import { Download } from 'lucide-react'
import { computeAge } from '@/lib/age'

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
  const tenantId = typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant

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

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Âge</th>
              <th className="px-4 py-3 font-medium">Dernière consultation</th>
              <th className="px-4 py-3 font-medium">Date de naissance</th>
              <th className="px-4 py-3 font-medium">CIN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-400">
                  {q ? 'Aucun patient trouvé pour cette recherche.' : 'Aucun patient pour le moment.'}
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PatientActionsDropdown patientId={p.id} patientName={p.fullName} />
                      <Link
                        href={`/dashboard/patients/${p.id}`}
                        className="font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200"
                      >
                        {p.fullName}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-500">
                    {p.birthDate ? computeAge(p.birthDate) : '—'}
                  </td>
                  <td className="px-4 py-3 text-stone-500">
                    {lastConsultations[p.id]
                      ? new Date(lastConsultations[p.id]).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-stone-500">
                    {p.birthDate
                      ? new Date(p.birthDate).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-stone-500">{p.nationalId || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
