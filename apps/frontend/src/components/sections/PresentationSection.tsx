import { getTranslations } from 'next-intl/server'
import { CheckCircle } from 'lucide-react'

type Props = {
  locale: string
}

export default async function PresentationSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'presentation' })

  const experiences = [
    { key: 'experience_chu' },
    { key: 'experience_biougra' },
    { key: 'diploma' },
  ] as const

  return (
    <section id="presentation" className="scroll-mt-24 bg-gradient-to-b from-cream-100 to-white bg-white bg-[length:100%_16px] bg-[position:0_0] bg-no-repeat px-4 py-20 md:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-container">
        <h2 className="text-center font-heading text-3xl font-bold text-stone-800 md:text-4xl">
          {t('title')}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-stone-600">
          {t('intro')}
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-xl font-semibold text-stone-700">
              {t('section1_title')}
            </h3>
            <ul className="flex flex-col gap-3">
              {experiences.map(({ key }) => (
                <li key={key} className="flex items-start gap-3 rtl:flex-row-reverse">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-primary-600" />
                  <span className="text-stone-600">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-xl font-semibold text-stone-700">
              {t('section2_title')}
            </h3>
            <p className="leading-relaxed text-stone-600">
              {t('description')}
            </p>
          </div>
        </div>

        <p className="mx-auto mt-12 w-fit rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
          {t('languages')}
        </p>
      </div>
    </section>
  )
}
