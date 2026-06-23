import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'hero' })

  return (
    <main className="flex-1">
      <section className="flex min-h-[calc(100vh-5rem)] items-center bg-cream-100 px-4 md:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-container items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-6">
            <h1 className="font-heading text-4xl font-bold leading-tight text-stone-800 md:text-5xl lg:text-6xl">
              {t('tagline')}
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-stone-500">
              Pédiatre à Inezgane, dédiée à la santé et au bien-être des enfants.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-cta-600 px-6 py-3 text-base text-white hover:bg-cta-700">
                Prendre rendez-vous
              </Button>
              <Button variant="outline" className="px-6 py-3 text-base">
                En savoir plus
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary-500" />
                Pédiatre conventionnée
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary-500" />
                Inezgane, Maroc
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary-500" />
                4 langues
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute -left-6 -top-6 size-64 rounded-full bg-primary-100/60 md:size-80" />
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-primary-50 shadow-lg">
              <div className="flex h-full items-center justify-center text-primary-200">
                <svg
                  className="size-32"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={0.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
