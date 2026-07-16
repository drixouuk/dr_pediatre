import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import Link from 'next/link'

type Patient = {
  id: string
  fullName: string
  nationalId?: string
  medicalNotes?: string
  updatedAt: string
}

export default async function PatientsListPage() {
  const user = await requireAuth()
  const data = await fetchCMS<{ docs: Patient[] }>(
    `/api/patients?where[tenant][equals]=${typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant}&sort=-updatedAt&limit=50`,
    { revalidate: 0 },
  )
  const patients = data?.docs ?? []

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-stone-800">Patients</h1>
        <Link
          href="./new"
          className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
        >
          + Nouveau patient
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
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
                  Aucun patient pour le moment.
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
                      href={`./${p.id}`}
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
