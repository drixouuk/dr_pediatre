import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from './LanguageSwitcher'

type Props = {
  locale: string
}

export default async function Header({ locale }: Props) {
  const nav = await getTranslations({ locale, namespace: 'nav' })
  const h = await getTranslations({ locale, namespace: 'header' })

  const navLinks = [
    { href: '/', label: nav('home') },
    { href: '/presentation', label: nav('presentation') },
    { href: '/services', label: nav('services') },
    { href: '/infos', label: nav('infos') },
    { href: '/contact', label: nav('contact') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-primary-700 hover:text-primary-600 transition-colors duration-200"
        >
          <span className="hidden sm:inline">{h('doctorName')}</span>
          <span className="sm:hidden">{h('doctorNameShort')}</span>
          <span className="hidden text-sm font-normal text-stone-500 md:inline">
            {h('specialty')}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-cream-200 hover:text-primary-700 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  )
}
