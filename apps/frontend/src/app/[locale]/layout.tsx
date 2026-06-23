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

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
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
      <body className={`${bodyFont} flex min-h-full flex-col bg-cream-100 text-stone-800 antialiased`}>
        <NextIntlClientProvider>
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
