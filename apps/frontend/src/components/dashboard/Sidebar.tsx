import type { PayloadUser } from '@/lib/auth'
import { getTenantById } from '@/lib/payload'
import { headers } from 'next/headers'
import { Link } from '@/i18n/navigation'
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  ShieldAlert,
  LogOut,
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  roles?: string[]
  disabled?: boolean
}

type Props = {
  user: PayloadUser
}

export default async function Sidebar({ user }: Props) {
  const h = await headers()
  const currentPath = h.get('x-pathname') || ''

  const tenantId = typeof user.tenant === 'object' ? (user.tenant as any).id : user.tenant
  const tenant = tenantId ? await getTenantById(tenantId) : null

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const roleLabels: Record<string, string> = {
    superadmin: 'Super Admin',
    tenant_admin: 'Admin',
    doctor: 'Médecin',
    secretary: 'Secrétaire',
  }
  const roleLabel = user.roles
    ?.map((r) => roleLabels[r] || r)
    .join(', ')

  const navItems: NavItem[] = [
    { label: 'Vue d\'ensemble', href: '/dashboard', icon: <LayoutDashboard className="size-4" /> },
    { label: 'Patients', href: '/dashboard/patients', icon: <Users className="size-4" /> },
    { label: 'File d\'attente', href: '/dashboard', icon: <Clock className="size-4" /> },
    { label: 'Rendez-vous', href: '#', icon: <Calendar className="size-4" />, disabled: true },
  ]

  const adminItems: NavItem[] = []

  if (user.roles?.includes('tenant_admin') || user.roles?.includes('superadmin')) {
    adminItems.push({
      label: 'Registre d\'audit',
      href: '/dashboard/audit-logs',
      icon: <FileText className="size-4" />,
    })
  }

  if (user.roles?.includes('superadmin')) {
    adminItems.push({
      label: 'Alertes système',
      href: '/dashboard/system-alerts',
      icon: <ShieldAlert className="size-4" />,
    })
  }

  function isActive(href: string): boolean {
    if (href === '#') return false
    if (href === '/dashboard') {
      return currentPath === `/${currentPath.split('/')[1]}/dashboard` || currentPath.endsWith('/dashboard')
    }
    return currentPath.includes(href)
  }

  return (
    <aside className="flex w-[208px] shrink-0 flex-col border-r border-stone-200 bg-stone-50">
      <div className="flex flex-col px-4 pt-6 pb-4">
        <h2 className="font-heading text-sm font-medium text-stone-800 leading-tight">
          {tenant?.name || 'Cabinet'}
        </h2>
        {tenant && (
          <p className="mt-0.5 text-xs text-stone-500">
            {tenant.settings?.activeTier || ''}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                item.disabled
                  ? 'pointer-events-none text-stone-300'
                  : active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
              }`}
              aria-disabled={item.disabled}
              tabIndex={item.disabled ? -1 : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}

        {adminItems.length > 0 && (
          <>
            <div className="my-2 border-t border-stone-200" />
            {adminItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="border-t border-stone-200 px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-800">
              {user.name || user.email}
            </p>
            <p className="truncate text-xs text-stone-500">{roleLabel}</p>
          </div>
        </div>
        <form
          action="/api/auth/logout"
          method="POST"
          className="mt-3"
        >
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-red-600"
          >
            <LogOut className="size-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  )
}
