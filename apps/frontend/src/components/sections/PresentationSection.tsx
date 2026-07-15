import { getTranslations } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Doctor } from '@/lib/payload'

type Props = {
  locale: string
  doctor: Doctor | null
}

export default async function PresentationSection({ locale, doctor }: Props) {
  const t = await getTranslations({ locale, namespace: 'presentation' })
  if (!doctor) return null

  if (!doctor.bio) return null

  return (
    <section id="presentation" className="scroll-mt-24 bg-gradient-to-b from-cream-100 to-white bg-white bg-[length:100%_16px] bg-[position:0_0] bg-no-repeat px-4 py-20 md:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-container">
        <div className="prose prose-stone mx-auto mt-6 max-w-2xl prose-p:text-lg prose-p:leading-relaxed prose-p:text-stone-600 prose-p:mt-4 prose-p:mb-4 prose-headings:font-heading prose-headings:text-stone-800 prose-headings:mt-8 prose-headings:mb-4 prose-li:text-stone-600 prose-li:marker:text-primary-500">
          <RichText data={doctor.bio as any} />
        </div>

        {doctor.specialty && (
          <p className="mx-auto mt-12 w-fit rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
            {doctor.specialty}
          </p>
        )}
      </div>
    </section>
  )
}
