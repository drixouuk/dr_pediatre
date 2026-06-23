import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import {
  Figtree,
  Noto_Sans,
  Noto_Sans_Arabic,
  Noto_Sans_Tifinagh,
} from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
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

const seoByLocale: Record<string, { title: string; description: string }> = {
  fr: {
    title: 'Dr Guinane Aicha — Pédiatre à Inezgane',
    description:
      'Pédiatre à Inezgane, Dr Guinane Aicha accompagne vos enfants avec une médecine attentive et bienveillante. Consultations en français, arabe et tamazight.',
  },
  ar: {
    title: 'د. قينان عائشة — طبيبة أطفال في إنزكان',
    description:
      'طبيبة أطفال في إنزكان، الدكتورة قينان عائشة ترافق أطفالكم بطب رفيق ومتفهم. استشارات بالعربية والفرنسية والأمازيغية.',
  },
  en: {
    title: 'Dr Guinane Aicha — Pediatrician in Inezgane',
    description:
      'Pediatrician in Inezgane, Dr Guinane Aicha cares for your children with attentive and compassionate medicine. Consultations in French, Arabic and Tamazight.',
  },
  tzm: {
    title: 'Dr Guinane Aicha — Tamsiwelt n izdanen deg Inezgan',
    description:
      'Tamsiwelt n izdanen deg Inezgan, Duktura Guinane Aicia tettawi izdanen s tɣawsa d tmusni. Asqadci s tafransist, taɛrabt d tmazight.',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const seo = seoByLocale[locale] ?? seoByLocale.fr

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      locale: locale === 'tzm' ? 'ber' : locale,
      siteName: 'Dr Guinane Aicha',
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

  const dir = dirByLocale[locale] ?? 'ltr'
  const fontVars = fontsByLocale[locale] ?? notoSans.variable
  const bodyFont = bodyFontByLocale[locale] ?? 'font-body'

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
          <Header />
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
