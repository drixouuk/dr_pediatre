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
    <footer className="bg-primary-800 text-white">
      <div className="h-2 bg-gradient-to-b from-cream-100 to-primary-800" />
      <div className="mx-auto max-w-container px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="text-sm font-medium text-stone-300">
            Dr Guinane Aicha <span className="text-stone-500">—</span>{' '}
            <span className="font-normal text-stone-200">{f('specialty')}</span>
          </p>

          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className="text-stone-200 transition-colors duration-200 hover:text-white"
              >
                {n(key)}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-stone-200">{i('address_line3')}</p>
        </div>

        <p className="mt-4 text-center text-xs text-stone-200">
          {f('copyright')}
        </p>
      </div>
    </footer>
  )
}
