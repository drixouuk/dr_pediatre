import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { Link } from '@/i18n/navigation'

type Patient = {
  id: string
  fullName: string
  nationalId?: string
  medicalNotes?: string
  updatedAt: string
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
        <div className="flex gap-2">
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

      <div className="mt-4 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">CIN</th>
              <th className="px-4 py-3 font-medium">Dernier accès</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-stone-400">
                  {q ? 'Aucun patient trouvé pour cette recherche.' : 'Aucun patient pour le moment.'}
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-800">{p.fullName}</td>
                  <td className="px-4 py-3 text-stone-500">{p.nationalId || '—'}</td>
                  <td className="px-4 py-3 text-stone-500">
                    {new Date(p.updatedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/patients/${p.id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
