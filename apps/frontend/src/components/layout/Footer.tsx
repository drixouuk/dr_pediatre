import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

type Props = {
  locale: string
}

export default async function Footer({ locale }: Props) {
  const f = await getTranslations({ locale, namespace: 'footer' })
  const n = await getTranslations({ locale, namespace: 'nav' })
  const i = await getTranslations({ locale, namespace: 'infos' })

  const navLinks = [
    { href: '/', key: 'home' },
    { href: '/#presentation', key: 'presentation' },
    { href: '/#services', key: 'services' },
    { href: '/#infos', key: 'infos' },
    { href: '/#contact', key: 'contact' },
  ] as const

  return (
    <footer className="bg-stone-700 text-white">
      <div className="h-8 bg-gradient-to-b from-cream-100 to-stone-700" />
      <div className="mx-auto max-w-container px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-sm font-medium text-stone-300">
            Dr Guinane Aicha <span className="text-stone-500">—</span>{' '}
            <span className="font-normal text-stone-400">{f('specialty')}</span>
          </p>

          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className="text-stone-400 transition-colors duration-200 hover:text-white"
              >
                {n(key)}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-stone-400">{i('address_line3')}</p>
        </div>

        <p className="mt-4 text-center text-xs text-stone-600">
          &copy; 2025 Dr Guinane Aicha &mdash; Tous droits r&eacute;serv&eacute;s
        </p>
      </div>
    </footer>
  )
}
