'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import LanguageSwitcher from './LanguageSwitcher'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/#presentation', key: 'presentation' },
  { href: '/#services', key: 'services' },
  { href: '/#infos', key: 'infos' },
  { href: '/#contact', key: 'contact' },
] as const

export default function Header() {
  const t = useTranslations('nav')
  const h = useTranslations('header')
  const isHidden = useScrollDirection()

  return (
    <header
      className={`navbar-floating transition-transform duration-300 ${
        isHidden ? '-translate-y-[calc(100%+2rem)]' : 'translate-y-0'
      }`}
    >
      <nav
        className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md md:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-primary-700 hover:text-primary-600 transition-colors duration-200"
        >
          <span className="hidden sm:inline">{h('doctorName')}</span>
          <span className="sm:hidden">{h('doctorNameShort')}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-cream-200 hover:text-primary-700 transition-colors duration-200"
            >
              {t(key)}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button className="hidden bg-cta-600 text-white hover:bg-cta-700 md:inline-flex">
            {t('cta')}
          </Button>
        </div>
      </nav>
    </header>
  )
}
