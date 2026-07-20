import { requireAuth } from '@/lib/auth'
import { getTenantById } from '@/lib/payload'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'

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
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
