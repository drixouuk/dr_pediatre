'use client'

import { usePathname, useRouter } from '@/i18n/navigation'

const locales = [
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'tzm', label: 'ⵜⴰⵎⴰⵣⵉⵖⵜ' },
] as const

type Props = {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav aria-label="Language switcher" className="flex items-center gap-1">
      {locales.map(({ code, label }) => {
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
            {label}
          </button>
        )
      })}
    </nav>
  )
}
