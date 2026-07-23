import type { PayloadUser } from '@/lib/auth'
import type { Tenant } from '@/lib/payload'
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  BarChart3,
  Calendar,
  Settings,
  FileText,
  ShieldAlert,
  LogOut,
} from 'lucide-react'
import SidebarNav from './SidebarNav'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

type Props = {
  user: PayloadUser
  tenant?: Tenant | null
  onNavigate?: () => void
}

export default function Sidebar({ user, tenant, onNavigate }: Props) {
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const roleLabels: Record<string, string> = {
    superadmin: 'Super Admin',
    tenant_admin: 'Admin',
    doctor: 'Médecin',
    secretary: 'Secrétaire',
  }
  const tierLabels: Record<string, string> = {
    vitrine: 'Site vitrine',
    rdv: 'RDV en ligne',
    dossier: 'Cabinet individuel',
    clinique: 'Cabinet de groupe',
  }
  const roleLabel = user.roles?.map((r) => roleLabels[r] || r).join(', ')

  const navItems: NavItem[] = [
    { label: 'Vue d\'ensemble', href: '/dashboard', icon: <LayoutDashboard className="size-4" /> },
    { label: 'Patients', href: '/dashboard/patients', icon: <Users className="size-4" /> },
    { label: 'File d\'attente', href: '/dashboard/queue', icon: <ListOrdered className="size-4" /> },
    { label: 'Activité', href: '/dashboard/activity', icon: <BarChart3 className="size-4" /> },
    { label: 'Rendez-vous', href: '/dashboard/rendez-vous', icon: <Calendar className="size-4" /> },
    { label: 'Paramètres', href: '/dashboard/settings', icon: <Settings className="size-4" /> },
  ]

  const adminItems: NavItem[] = []

  if (user.roles?.includes('tenant_admin') || user.roles?.includes('superadmin')) {
    adminItems.push({ label: 'Registre d\'audit', href: '/dashboard/audit-logs', icon: <FileText className="size-4" /> })
  }
  if (user.roles?.includes('superadmin')) {
    adminItems.push({ label: 'Alertes système', href: '/dashboard/system-alerts', icon: <ShieldAlert className="size-4" /> })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col px-4 pt-6 pb-4">
        <h2 className="font-heading text-sm font-medium text-stone-800 leading-tight">{tenant?.name || 'Cabinet'}</h2>
        {tenant && <p className="mt-0.5 text-xs text-stone-500">{tierLabels[tenant.settings?.activeTier] || tenant.settings?.activeTier || ''}</p>}
      </div>

      <SidebarNav items={navItems} adminItems={adminItems} onNavigate={onNavigate} />

      <div className="border-t border-cream-200 px-3 py-4 mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-800">{user.name || user.email}</p>
            <p className="truncate text-xs text-stone-500">{roleLabel}</p>
            {user.roles?.includes('substitute') && user.accessExpiresAt && (
              <p className="mt-0.5 text-xs text-warning">Accès jusqu'au {new Date(user.accessExpiresAt).toLocaleDateString('fr-FR')}</p>
            )}
            {user.roles?.includes('substitute') && user.accessExpiresAt && (() => {
              const expiresAt = new Date(user.accessExpiresAt)
              const hoursLeft = (expiresAt.getTime() - Date.now()) / 3600000
              if (hoursLeft > 0 && hoursLeft <= 2) {
                return (
                  <p className="mt-1 text-xs font-medium text-warning bg-warning/10 rounded px-2 py-1">
                    Expire dans {hoursLeft < 1 ? `${Math.round(hoursLeft * 60)} min` : `${Math.round(hoursLeft)}h`}
                  </p>
                )
              }
              return null
            })()}
          </div>
        </div>
        <form action="/api/auth/logout" method="POST" className="mt-3">
          <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:bg-cream-200 hover:text-red-600">
            <LogOut className="size-4" />Déconnexion
          </button>
        </form>
      </div>
    </div>
  )
}
