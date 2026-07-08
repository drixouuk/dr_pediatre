import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import LiveStatsWidget from '@/components/dashboard/LiveStatsWidget'
import WaitingRoomList from '@/components/dashboard/WaitingRoomList'

const navLinks = [
  { href: './patients', label: 'Patients' },
  { href: './audit-logs', label: 'Registre d\'audit' },
]

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-stone-800">Tableau de bord</h1>
          <p className="mt-1 text-stone-500">
            Bienvenue{user.name ? `, ${user.name}` : ''}
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-primary-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        <LiveStatsWidget />
      </div>

      <div className="mt-8">
        <WaitingRoomList />
      </div>
    </div>
  )
}
