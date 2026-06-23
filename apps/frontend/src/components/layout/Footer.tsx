import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MapPin, Phone } from 'lucide-react'

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
    <footer className="border-t border-stone-700 bg-stone-900 text-white">
      <div className="mx-auto max-w-container px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <p className="text-lg font-semibold">Dr Guinane Aicha</p>
            <p className="text-sm leading-relaxed text-stone-400">
              {f('specialty')} — {f('location')}
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
              {n('home')}
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-stone-400 transition-colors duration-200 hover:text-white"
                  >
                    {n(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">
              Contact
            </p>
            {i('phone') !== '—' && (
              <a
                href={`tel:${i('phone')}`}
                className="inline-flex items-center gap-2 text-sm text-stone-400 transition-colors duration-200 hover:text-white"
              >
                <Phone className="size-4 shrink-0" />
                {i('phone')}
              </a>
            )}
            <div className="inline-flex items-start gap-2 text-sm text-stone-400">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {i('address_line1')}, {i('address_line2')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto max-w-container px-4 py-4 text-center text-xs text-stone-500 md:px-6 lg:px-8">
          &copy; 2025 Dr Guinane Aicha &mdash; Tous droits r&eacute;serv&eacute;s
        </div>
      </div>
    </footer>
  )
}
