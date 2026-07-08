'use client'

import { useRef, useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import type { CalComSettings } from '@/lib/payload'

type Props = {
  calcom: CalComSettings
  locale?: string
}

export default function CalBookingWidget({ calcom, locale }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const eventSlug = calcom.eventSlug || 'consultation-pediatrique'
  const username = calcom.username || 'drixou'
  const baseUrl = calcom.customUrl || 'https://calcom.drixou.uk'
  const embedJsUrl = `${baseUrl}/embed/embed.js`
  const calLink = `${username}/${eventSlug}`

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return

    let cancelled = false

    ;(async () => {
      const cal = await getCalApi({ embedJsUrl })
      if (cancelled) return

      cal('ui', {
        styles: { branding: { brandColor: '#0D9488' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()

    return () => {
      cancelled = true
    }
  }, [visible, embedJsUrl])

  return (
    <section
      ref={sectionRef}
      className="scroll-mt-24 bg-gradient-to-b from-cream-100 to-white px-4 py-20 md:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-container">
        <div
          className="mx-auto mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          style={{ maxWidth: '800px', width: '100%', minHeight: '600px' }}
        >
          {visible && (
            <Cal
              namespace="booking"
              calLink={calLink}
              style={{ width: '100%', height: '100%', overflow: 'scroll' }}
              config={{ layout: 'month_view' }}
              calOrigin={baseUrl}
              embedJsUrl={embedJsUrl}
            />
          )}
        </div>
      </div>
    </section>
  )
}
