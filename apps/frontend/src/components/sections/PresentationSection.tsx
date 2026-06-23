import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
};

export default async function PresentationSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "presentation" });

  return (
    <section
      id="presentation"
      className="scroll-mt-24 bg-white px-4 py-20 md:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-container">
        <div className="mx-auto max-w-3xl text-center">
          {/* Titre Principal */}
          <h2 className="font-heading text-3xl font-bold text-stone-800 md:text-4xl">
            {t("title")}
          </h2>

          <div className="mt-8 space-y-6 text-left text-base leading-relaxed text-stone-600 md:text-lg">
            {/* Introduction */}
            <p>{t("intro")}</p>

            {/* Bloc Parcours d'excellence */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-stone-700">
                {t("section1_title")} :
              </h3>
              <ul className="list-disc space-y-2 ps-6 text-stone-600">
                <li>{t("experience_chu")}</li>
                <li>{t("experience_biougra")}</li>
                <li>{t("diploma")}</li>
              </ul>
            </div>

            {/* Bloc Approche humaine */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-stone-700">
                {t("section2_title")} :
              </h3>
              <p>{t("description")}</p>
            </div>
          </div>

          {/* Badge Langues */}
          <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 ring-1 ring-primary-200">
            {t("languages")}
          </p>
        </div>
      </div>
    </section>
  );
}
