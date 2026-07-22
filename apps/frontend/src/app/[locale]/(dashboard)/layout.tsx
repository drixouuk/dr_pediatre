import { requireAuth } from '@/lib/auth'
import { getTenantById } from '@/lib/payload'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardLayout({ children }: Props) {
  const user = await requireAuth()

  const tenantId = typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant
  if (tenantId) {
    const tenant = await getTenantById(tenantId)
    const tier = tenant?.settings?.activeTier
    if (!tier || (tier !== 'dossier' && tier !== 'clinique')) {
      redirect('/')
    }
    return <DashboardShell user={user} tenant={tenant}>{children}</DashboardShell>
  }

  return <DashboardShell user={user} tenant={null}>{children}</DashboardShell>
}
