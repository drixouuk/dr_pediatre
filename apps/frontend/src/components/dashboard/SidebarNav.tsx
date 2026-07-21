'use client'

import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

type Props = {
  items: NavItem[]
  adminItems: NavItem[]
}

function isActive(href: string, pathname: string): boolean {
  if (href === '#') return false
  if (href === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/dashboard/'
  }
  return pathname.startsWith(href)
}

export default function SidebarNav({ items, adminItems }: Props) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-0.5 px-3">
      {items.map((item) => {
        const active = isActive(item.href, pathname)
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              item.disabled
                ? 'pointer-events-none text-stone-300'
                : active
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-stone-600 hover:bg-cream-200 hover:text-stone-800'
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
          <div className="my-2 border-t border-cream-200" />
          {adminItems.map((item) => {
            const active = isActive(item.href, pathname)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-stone-600 hover:bg-cream-200 hover:text-stone-800'
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
  )
}
