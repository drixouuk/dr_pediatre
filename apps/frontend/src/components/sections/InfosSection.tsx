import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Clock, CreditCard, Mail, MapPinned } from "lucide-react";
import OrientationLightbox from "@/components/ui/OrientationLightbox";
import ContactForm from "@/components/ui/ContactForm";
import type { PracticeInfo } from "@/lib/payload";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms.drixou.uk";

type Props = {
  locale: string;
  practiceInfo: PracticeInfo | null;
};

function extractPricingText(value: unknown): string {
  if (!value) return ''
  const root = (value as any)?.root
  if (!root?.children?.[0]?.children) return ''
  return root.children[0].children
    .map((c: any) => c.text || '')
    .join('')
}

export default async function InfosSection({ locale, practiceInfo }: Props) {
  const t = await getTranslations({ locale, namespace: "infos" });
  const d = await getTranslations({ locale, namespace: "infos.days" });
  const c = await getTranslations({ locale, namespace: "contact" });

  const schedule = practiceInfo?.schedules?.length
    ? practiceInfo.schedules.map(s => {
        const timeParts = [s.open, s.close].filter(Boolean)
        const timeStr = timeParts.length === 2
          ? `${timeParts[0]}–${timeParts[1]}`
          : timeParts[0] || ''
        return { dayKey: s.day, hours: timeStr }
      })
    : [];

  return (
    <section
      id="infos"
      className="scroll-mt-24 bg-gradient-to-b from-white to-cream-100 bg-cream-100 bg-[length:100%_16px] bg-[position:0_0] bg-no-repeat px-4 py-12 md:px-6 md:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-container">
        <h2 className="text-center font-heading text-3xl font-bold text-stone-800 md:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-12 mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-6 md:order-1">
            <div className="flex items-center gap-2">
              <MapPinned className="size-5 text-primary-600" />
              <h3 className="font-semibold text-stone-700">
                {t("address_title")}
              </h3>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-primary-600" />
              <div>
                <p>{practiceInfo?.address || t("address_title")}</p>
              </div>
            </div>

            {practiceInfo?.phone && (
              <div className="flex items-start gap-4">
                <Phone className="mt-1 size-5 shrink-0 text-primary-600" />
                <p>{practiceInfo.phone}</p>
              </div>
            )}

            <div className="flex items-start gap-4">
              <CreditCard className="mt-1 size-5 shrink-0 text-primary-600" />
              <div>
                <p className="font-medium text-stone-700">{t("fees_title")}</p>
                <p>{practiceInfo?.pricing ? extractPricingText(practiceInfo.pricing) : ''}</p>
                <p className="text-sm text-stone-500">{practiceInfo?.paymentNote || t("payment")}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:order-3">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary-600" />
              <h3 className="font-semibold text-stone-700">
                {t("hours_title")}
              </h3>
            </div>

            {schedule.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                {schedule.map((row) => (
                  <div
                    key={row.dayKey}
                    className="flex items-center justify-between border-b border-stone-100 px-4 py-2.5 text-sm last:border-b-0"
                  >
                    <span className="font-medium text-stone-700">
                      {d(row.dayKey as any)}
                    </span>
                    <span className="text-stone-500">{row.hours}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="text-sm text-stone-500">{practiceInfo?.hoursNote || t("hours_note")}</p>
          </div>

          <div className="overflow-hidden rounded-xl md:order-5">
            {practiceInfo?.coordinates?.lat && practiceInfo?.coordinates?.lng ? (
              <iframe
                src={`https://www.google.com/maps?q=${practiceInfo.coordinates.lat},${practiceInfo.coordinates.lng}&z=17&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full min-h-[200px] md:min-h-[400px]"
                title="Cabinet médical — Inezgane"
              />
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center bg-stone-50 md:min-h-[400px]">
                <p className="text-sm text-stone-400">Carte non disponible</p>
              </div>
            )}
          </div>

          <div className="h-[200px] md:h-[400px] md:order-4 md:col-span-2">
            <OrientationLightbox
              src={`${CMS_URL}/media/orientation.png`}
              alt={t("orientationImageAlt")}
            />
          </div>

          <div className="flex flex-col gap-4 md:order-2">
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-primary-600" />
              <h3 className="font-semibold text-stone-700">{c("title")}</h3>
            </div>
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
