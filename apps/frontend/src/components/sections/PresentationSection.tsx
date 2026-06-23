import { getTranslations } from 'next-intl/server'

type Props = {
  locale: string
}

export default async function PresentationSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'presentation' })

  const paragraphs = t('body').split('\n\n')

  return (
    <section id="presentation" className="scroll-mt-24 bg-white px-4 py-20 md:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-stone-800 md:text-4xl">
            {t('title')}
          </h2>
          <div className="mt-8 space-y-4 text-left text-base leading-relaxed text-stone-600 md:text-lg">
            {paragraphs.map((p, i) => {
              const trimmed = p.trim()
              const isSectionTitle = trimmed.endsWith(':') && !trimmed.startsWith(' ')
              const isBullet = p.startsWith('    ')
              return (
                <p key={i} className={`${isSectionTitle ? 'font-semibold text-stone-700' : ''} ${isBullet ? 'ps-8' : ''}`}>
                  {trimmed}
                </p>
              )
            })}
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 ring-1 ring-primary-200">
            {t('languages')}
          </p>
        </div>
      </div>
    </section>
  )
}
