import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Clock, CreditCard } from "lucide-react";

type Props = {
  locale: string;
};

const schedule = [
  { dayKey: "mon", morning: "09h–16h30" },
  { dayKey: "tue", morning: "09h–16h30" },
  { dayKey: "wed", morning: "09h–16h30" },
  { dayKey: "thu", morning: "09h–16h30" },
  { dayKey: "fri", morning: "09h–16h30" },
  { dayKey: "sat", morning: "09h–12h", afternoon: "—" },
] as const;

export default async function InfosSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "infos" });
  const d = await getTranslations({ locale, namespace: "infos.days" });

  return (
    <section
      id="infos"
      className="scroll-mt-24 bg-white px-4 py-20 md:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-container">
        <h2 className="text-center font-heading text-3xl font-bold text-stone-800 md:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-12 mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-6">
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

          <div className="flex flex-col gap-4">
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
                    {'afternoon' in row && (
                      <>
                        <span className="mx-2 text-stone-300">/</span>
                        {row.afternoon}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-stone-400">{t("hours_note")}</p>
          </div>
        </div>

        <div className="mt-8 md:col-span-2">
          <iframe
            src="https://www.google.com/maps?q=30.3577836,-9.5279668&z=17&output=embed"
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
            title="Cabinet Dr Guinane Aicha — Inezgane"
          />
        </div>
      </div>
    </section>
  );
}
