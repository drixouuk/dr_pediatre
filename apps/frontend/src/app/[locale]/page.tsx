import { setRequestLocale, getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

type PracticeInfo = {
  address?: string
  phone?: string
}

const CMS_BASE = process.env.CMS_BASE ?? 'http://localhost:3001'

async function fetchPracticeInfo(locale: string): Promise<PracticeInfo | null> {
  try {
    const res = await fetch(
      `${CMS_BASE}/api/practice-info?locale=${locale}&depth=1`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'hero' })
  const u = await getTranslations({ locale, namespace: 'ui' })

  const practice = await fetchPracticeInfo(locale)
  const title = t('welcome')

  return (
    <main className="mx-auto w-full max-w-container flex-1 px-4 py-12 md:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold text-stone-800 md:text-5xl">
        {title}
      </h1>

      {practice && (
        <div className="space-y-4 text-stone-600">
          {practice.address && <p>{practice.address}</p>}
          {practice.phone && practice.phone !== '—' && (
            <p>
              <span className="font-medium text-stone-700">{u('phone')} :</span>{' '}
              {practice.phone}
            </p>
          )}
        </div>
      )}
    </main>
  )
}
