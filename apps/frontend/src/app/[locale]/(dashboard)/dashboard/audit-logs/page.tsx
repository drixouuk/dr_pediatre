import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { getTenantId } from '@/lib/tenant'

type AuditLog = {
  id: string
  action: 'read' | 'write' | 'export'
  collectionName: string
  documentId: string
  user: { id: string; name?: string; email?: string }
  timestamp: string
}

export default async function AuditLogsPage() {
  const user = await requireAuth()

  const isAdmin =
    user.roles?.includes('superadmin') || user.roles?.includes('tenant_admin')
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
        <p className="text-stone-500">Accès réservé aux administrateurs du cabinet.</p>
      </div>
    )
  }

  const data = await fetchCMS<{ docs: AuditLog[] }>(
    `/api/audit-logs?where[tenant][equals]=${getTenantId(user)}&sort=-timestamp&limit=100`,
    { revalidate: 0 },
  )
  const logs = data?.docs ?? []

  const actionLabels: Record<string, string> = {
    read: 'Consultation',
    write: 'Modification',
    export: 'Export',
  }

  const actionColors: Record<string, string> = {
    read: 'text-blue-600 bg-blue-50',
    write: 'text-amber-600 bg-amber-50',
    export: 'text-purple-600 bg-purple-50',
  }

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-800">
          Registre d&apos;audit (Loi 09-08)
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Historique immuable des accès et modifications des données de santé.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Collection</th>
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Utilisateur</th>
              <th className="px-4 py-3 font-medium">Horodatage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-400">
                  Aucune entrée d&apos;audit.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${actionColors[log.action] || 'text-stone-600 bg-stone-50'}`}
                    >
                      {actionLabels[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600">{log.collectionName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">{log.documentId}</td>
                  <td className="px-4 py-3 text-stone-600">{log.user?.name || log.user?.email || '—'}</td>
                  <td className="px-4 py-3 text-stone-500">
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
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
