'use client'

import { usePathname } from '@/i18n/navigation'

type Props = {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

export default function LayoutShell({ children, header, footer }: Props) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && header}
      <div className={isDashboard ? 'flex flex-1 flex-col' : 'flex flex-1 flex-col pt-16 md:pt-20'}>
        {children}
      </div>
      {!isDashboard && footer}
    </>
  )
}
