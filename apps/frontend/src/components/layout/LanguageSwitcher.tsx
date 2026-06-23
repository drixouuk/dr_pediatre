'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const localeCodes = ['fr', 'ar', 'en', 'tzm'] as const

export default function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('lang')
  const pathname = usePathname()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-full text-stone-600 hover:bg-cream-200 hover:text-primary-700 transition-colors duration-200 cursor-pointer">
        <Globe className="size-4" />
        <span className="sr-only">Switch language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {localeCodes.map((code) => {
          const isActive = code === locale
          return (
            <DropdownMenuItem
              key={code}
              onSelect={() => router.replace(pathname, { locale: code })}
              className={`${code === 'tzm' ? 'font-tifinagh' : ''} ${
                isActive ? 'bg-primary-50 font-medium text-primary-700' : ''
              }`}
            >
              <span className="flex-1">{t(code)}</span>
              {isActive && (
                <span className="text-primary-600 text-xs">✓</span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
