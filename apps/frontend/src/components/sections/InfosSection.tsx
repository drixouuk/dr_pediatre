import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Clock, CreditCard } from "lucide-react";
import OrientationLightbox from "@/components/ui/OrientationLightbox";
import ContactForm from "@/components/ui/ContactForm";

type Props = {
  locale: string;
};

const schedule = [
  { dayKey: "mon", morning: "09h–16h30" },
  { dayKey: "tue", morning: "09h–16h30" },
  { dayKey: "wed", morning: "09h–16h30" },
  { dayKey: "thu", morning: "09h–16h30" },
  { dayKey: "fri", morning: "09h–16h30" },
  { dayKey: "sat", morning: "09h–13h", afternoon: "—" },
] as const;

export default async function InfosSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "infos" });
  const d = await getTranslations({ locale, namespace: "infos.days" });
  const c = await getTranslations({ locale, namespace: "contact" });

  return (
    <section
      id="infos"
      className="scroll-mt-24 bg-gradient-to-b from-cream-100 to-white bg-white bg-[length:100%_32px] bg-[position:0_0] bg-no-repeat px-4 py-12 md:px-6 md:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-container">
        <h2 className="text-center font-heading text-3xl font-bold text-stone-800 md:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-12 mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {/* Address — first on mobile, col 2 on desktop */}
          <div className="flex flex-col gap-6 md:order-2">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-primary-600" />
              <div>
                <p>{t("address_line1")}</p>
                <p>{t("address_line2")}</p>
                <p className="font-medium text-stone-700">
                  {t("address_line3")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-primary-600" />
              <p>{t("phone")}</p>
            </div>

            <div className="flex items-start gap-4">
              <CreditCard className="mt-1 size-5 shrink-0 text-primary-600" />
              <div>
                <p className="font-medium text-stone-700">{t("fees_title")}</p>
                <p>{t("fees")}</p>
                <p className="text-sm text-stone-500">{t("payment")}</p>
              </div>
            </div>
          </div>

          {/* Hours — second on mobile, col 3 on desktop */}
          <div className="flex flex-col gap-4 md:order-3">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary-600" />
              <h3 className="font-semibold text-stone-700">
                {t("hours_title")}
              </h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              {schedule.map((row) => (
                <div
                  key={row.dayKey}
                  className="flex items-center justify-between border-b border-stone-100 px-4 py-2.5 text-sm last:border-b-0"
                >
                  <span className="font-medium text-stone-700">
                    {d(row.dayKey)}
                  </span>
                  <span className="text-stone-500">
                    {row.morning}
                    {"afternoon" in row && (
                      <>
                        <span className="mx-2 text-stone-300">/</span>
                        {row.afternoon}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-stone-500">{t("hours_note")}</p>
          </div>

          {/* Map — third on mobile, col 3 on desktop (row 2) */}
          <div className="overflow-hidden rounded-xl md:order-5">
            <iframe
              src="https://www.google.com/maps?q=30.3577836,-9.5279668&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full min-h-[200px] md:min-h-[300px]"
              title="Cabinet Dr Guinane Aicha — Inezgane"
            />
          </div>

          {/* Orientation — fourth on mobile, col 1-2 on desktop (row 2) */}
          <div className="md:order-4 md:col-span-2">
            <OrientationLightbox
              src="/orientation.png"
              alt={t("orientationImageAlt")}
            />
          </div>

          {/* Form — last on mobile, col 1 on desktop (row 1) */}
          <div className="flex flex-col gap-4 md:order-1">
            <h3 className="font-semibold text-stone-700">{c("title")}</h3>
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
