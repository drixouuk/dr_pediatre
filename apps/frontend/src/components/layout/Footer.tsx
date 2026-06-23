import { getTranslations } from 'next-intl/server'

type Props = {
  locale: string
}

export default async function Footer({ locale }: Props) {
  const f = await getTranslations({ locale, namespace: 'footer' })

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-stone-500">
          <p className="font-medium text-stone-700">
            Dr Guinane Aicha
            <span className="mx-1.5 text-stone-300">|</span>
            <span className="font-normal">{f('specialty')}</span>
          </p>
          <p>{f('location')}</p>
        </div>
      </div>
    </footer>
  )
}
