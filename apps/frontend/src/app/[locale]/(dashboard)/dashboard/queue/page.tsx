import { requireAuth } from '@/lib/auth'
import LiveStatsWidget from '@/components/dashboard/LiveStatsWidget'
import WaitingRoomList from '@/components/dashboard/WaitingRoomList'

export default async function QueuePage() {
  await requireAuth()
  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-stone-800">File d&apos;attente</h1>
      <div className="mt-6">
        <LiveStatsWidget />
      </div>
      <div className="mt-6">
        <WaitingRoomList />
      </div>
    </div>
  )
}
