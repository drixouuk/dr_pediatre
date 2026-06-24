import { getTranslations } from 'next-intl/server'
import {
  Baby,
  Syringe,
  HeartPulse,
  Stethoscope,
  Apple,
  FileCheck,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Props = {
  locale: string
}

const serviceIcons = {
  nourrisson: Baby,
  vaccins: Syringe,
  suivi: HeartPulse,
  urgences: Stethoscope,
  nutrition: Apple,
  certificats: FileCheck,
} as const

export default async function ServicesSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'services' })

  const items = Object.keys(serviceIcons) as Array<keyof typeof serviceIcons>

  return (
    <section id="services" className="scroll-mt-24 bg-gradient-to-b from-white to-cream-100 bg-cream-100 bg-[length:100%_16px] bg-[position:0_0] bg-no-repeat px-4 py-20 md:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-stone-800 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-lg text-stone-500">{t('subtitle')}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((key) => {
            const Icon = serviceIcons[key]
            return (
              <Card key={key} className="border-stone-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="font-heading text-lg text-stone-800">
                    {t(`items.${key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-stone-500">
                    {t(`items.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
