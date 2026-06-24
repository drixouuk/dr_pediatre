'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

type Props = {
  locale: string
}

export default function ContactSection({ locale }: Props) {
  const t = useTranslations('contact')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <section className="scroll-mt-24 bg-gradient-to-b from-white to-cream-100 bg-cream-100 bg-[length:100%_64px] bg-[position:0_0] bg-no-repeat px-4 py-20 md:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-container text-center">
          <div className="mx-auto max-w-md rounded-2xl bg-white px-8 py-12 shadow-sm">
            <p className="text-lg font-medium text-stone-700">{t('success')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-cream-100 px-4 py-20 md:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-container">
        <h2 className="text-center font-heading text-3xl font-bold text-stone-800 md:text-4xl">
          {t('title')}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-xl space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-stone-700"
            >
              {t('name_label')}
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder={t('name_placeholder')}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-stone-700"
            >
              {t('phone_label')}
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder={t('phone_placeholder')}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-stone-700"
            >
              {t('message_label')}
            </label>
            <textarea
              id="message"
              rows={4}
              required
              placeholder={t('message_placeholder')}
              className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary-700 py-3 text-base text-white hover:bg-primary-800"
          >
            {t('send')}
          </Button>
        </form>
      </div>
    </section>
  )
}
