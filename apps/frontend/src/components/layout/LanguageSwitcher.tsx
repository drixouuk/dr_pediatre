'use client'

import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

const localeCodes = ['fr', 'ar', 'en', 'tzm'] as const

type Props = {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const t = useTranslations('lang')
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav aria-label="Language switcher" className="flex items-center gap-1">
      {localeCodes.map((code) => {
        const isActive = code === currentLocale
        return (
          <button
            key={code}
            onClick={() => router.replace(pathname, { locale: code })}
            className={`
              inline-flex items-center justify-center rounded-lg px-2.5 py-1.5
              text-xs font-medium leading-none
              transition-colors duration-200
              min-h-[36px] min-w-[36px]
              cursor-pointer
              ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-stone-600 hover:bg-cream-200 hover:text-primary-700'
              }
            `}
            aria-current={isActive ? 'true' : undefined}
          >
            {t(code)}
          </button>
        )
      })}
    </nav>
  )
}
