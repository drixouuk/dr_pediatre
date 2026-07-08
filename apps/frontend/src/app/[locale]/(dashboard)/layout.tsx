import { requireAuth } from '@/lib/auth'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function DashboardLayout({ children }: Props) {
  await requireAuth()
  return <>{children}</>
}
