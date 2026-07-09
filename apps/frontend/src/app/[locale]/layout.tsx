import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'
import {
  Figtree,
  Noto_Sans,
  Noto_Sans_Arabic,
  Noto_Sans_Tifinagh,
} from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getDoctorProfile } from '@/lib/payload'
import '../globals.css'

const figtree = Figtree({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
})

const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
})

const notoSansTifinagh = Noto_Sans_Tifinagh({
  subsets: ['tifinagh'],
  weight: ['400'],
  variable: '--font-tifinagh',
})

const siteUrl = 'https://dr-pediatre.vercel.app'

const DATA_LOCALE: Record<string, string> = {
  fr: 'fr', en: 'en', ar: 'ar', tzm: 'fr',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  const h = await headers()
  const tenantId = h.get('x-tenant-id') || 'default'
  const dataLocale = DATA_LOCALE[locale] || 'fr'

  const doctor = await getDoctorProfile(tenantId, dataLocale)
  const name = doctor?.name || ''
  const specialty = doctor?.specialty || ''

  const titles: Record<string, string> = {
    fr: name ? `${name} — ${specialty}` : 'Cabinet médical',
    en: name ? `${name} — ${specialty}` : 'Medical practice',
    ar: name ? `${name} — ${specialty}` : 'عيادة طبية',
    tzm: name ? `${name} — ${specialty}` : 'Asqadci n ujdiq',
  }

  const descriptions: Record<string, string> = {
    fr: name ? `${specialty} à Inezgane, ${name} accompagne vos enfants avec une médecine attentive et bienveillante. Consultations en plusieurs langues.` : '',
    en: name ? `${specialty} in Inezgane, ${name} cares for your children with attentive and compassionate medicine. Consultations in multiple languages.` : '',
    ar: name ? `${specialty} في إنزكان، ترافق أطفالكم بطب رفيق ومتفهم. استشارات بعدة لغات.` : '',
    tzm: name ? `${specialty} deg Inezgan, tettawi izdanen s tɣawsa d tmusni. Asqadci s tugt n tutlayin.` : '',
  }

  const title = titles[locale] || titles.fr
  const description = descriptions[locale] || descriptions.fr

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale === 'tzm' ? 'ber' : locale,
      siteName: name || 'Cabinet médical',
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        fr: `${siteUrl}/fr`,
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        tzm: `${siteUrl}/tzm`,
        'x-default': `${siteUrl}/fr`,
      } as Record<string, string>,
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const dirByLocale: Record<string, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  en: 'ltr',
  ar: 'rtl',
  tzm: 'ltr',
}

const fontsByLocale: Record<string, string> = {
  fr: `${notoSans.variable}`,
  en: `${notoSans.variable}`,
  ar: `${notoSansArabic.variable}`,
  tzm: `${notoSansTifinagh.variable}`,
}

const bodyFontByLocale: Record<string, string> = {
  fr: 'font-body',
  en: 'font-body',
  ar: 'font-body',
  tzm: 'font-tifinagh',
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const h = await headers()
  const tenantId = h.get('x-tenant-id') || 'default'
  const dataLocale = DATA_LOCALE[locale] || 'fr'
  const doctor = await getDoctorProfile(tenantId, dataLocale)

  const dir = dirByLocale[locale] ?? 'ltr'
  const fontVars = fontsByLocale[locale] ?? notoSans.variable
  const bodyFont = bodyFontByLocale[locale] ?? 'font-body'

  const doctorName = doctor?.name || ''
  const doctorNameShort = doctor?.name?.split(' ').slice(0, 2).join(' ') || ''

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${figtree.variable} ${fontVars} ${notoSansTifinagh.variable} h-full`}
    >
      <head>
        {routing.locales.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`${siteUrl}/${l}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/${routing.defaultLocale}`} />
      </head>
      <body className={`${bodyFont} flex min-h-full flex-col bg-cream-100 text-stone-800 antialiased pt-20`}>
        <NextIntlClientProvider>
          <Header doctorName={doctorName} doctorNameShort={doctorNameShort} />
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
