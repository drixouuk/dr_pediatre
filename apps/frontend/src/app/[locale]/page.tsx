import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="mx-auto w-full max-w-container flex-1 px-4 py-12 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-stone-800 md:text-5xl">
        Dr Guinane Aicha — Pédiatre à Inezgane
      </h1>
    </main>
  )
}
