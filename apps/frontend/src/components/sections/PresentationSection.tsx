import { getTranslations } from 'next-intl/server'
import type { Doctor } from '@/lib/payload'

type Props = {
  locale: string
  doctor: Doctor | null
}

function extractText(value: unknown): string {
  if (typeof value === 'string') return value
  const root = (value as any)?.root
  if (root?.children?.[0]?.children?.[0]?.text) return root.children[0].children[0].text
  return ''
}

export default async function PresentationSection({ locale, doctor }: Props) {
  const t = await getTranslations({ locale, namespace: 'presentation' })
  if (!doctor) return null

  const bio = extractText(doctor.bio)
  if (!bio) return null

  return (
    <section id="presentation" className="scroll-mt-24 bg-gradient-to-b from-cream-100 to-white bg-white bg-[length:100%_16px] bg-[position:0_0] bg-no-repeat px-4 py-20 md:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-container">
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-stone-600">
          {bio}
        </p>

        {doctor.specialty && (
          <p className="mx-auto mt-12 w-fit rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
            {doctor.specialty}
          </p>
        )}
      </div>
    </section>
  )
}
