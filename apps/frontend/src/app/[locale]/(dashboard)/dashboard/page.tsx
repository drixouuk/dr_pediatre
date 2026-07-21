import { requireAuth } from '@/lib/auth'
import { Link } from '@/i18n/navigation'
import LiveStatsWidget from '@/components/dashboard/LiveStatsWidget'
import PatientSearchBar from '@/components/dashboard/PatientSearchBar'
import QueuePreview from '@/components/dashboard/QueuePreview'
import VaccinationAlerts from '@/components/dashboard/VaccinationAlerts'

export default async function DashboardPage() {
  const user = await requireAuth()
  const isSuperadmin = user.roles?.includes('superadmin')

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-stone-800">Vue d&apos;ensemble</h1>
          <p className="mt-1 text-stone-500">
            Bienvenue{user.name ? `, ${user.name}` : ''}
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          <Link href="/dashboard/patients" className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-primary-700 transition-colors duration-200">
            Patients
          </Link>
          {(user.roles?.includes('tenant_admin') || isSuperadmin) && (
            <Link href="/dashboard/audit-logs" className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-primary-700 transition-colors duration-200">
              Registre d&apos;audit
            </Link>
          )}
          {isSuperadmin && (
            <Link href="/dashboard/system-alerts" className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-primary-700 transition-colors duration-200">
              Alertes système
            </Link>
          )}
        </nav>
      </div>

      <div className="mt-6">
        <PatientSearchBar />
      </div>

      <div className="mt-6">
        <LiveStatsWidget clickable />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QueuePreview />
        <VaccinationAlerts />
      </div>
    </div>
  )
}
