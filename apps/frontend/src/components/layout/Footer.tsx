import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  locale: string;
};

export default async function Footer({ locale }: Props) {
  const f = await getTranslations({ locale, namespace: "footer" });
  const n = await getTranslations({ locale, namespace: "nav" });
  const i = await getTranslations({ locale, namespace: "infos" });

  const navLinks = [
    { href: "/", key: "home" },
    { href: "/#presentation", key: "presentation" },
    { href: "/#services", key: "services" },
    { href: "/#reviews", key: "reviews" },
    { href: "/#infos", key: "infos" },
    { href: "/#contact", key: "contact" },
  ] as const;

  return (
    <footer className="bg-primary-800 text-white">
      <div className="h-2 bg-gradient-to-b from-cream-100 to-primary-800" />
      <div className="mx-auto max-w-container px-4 py-6 md:px-6 lg:px-8">
        {/* Remplacement du flex-row par un grid à 3 colonnes égales sur écran md */}
        <div className="flex flex-col items-center gap-4 text-center md:grid md:grid-cols-3 md:items-center">
          {/* Bloc Gauche - Aligné à gauche sur écran md */}
          <p className="text-sm font-medium text-stone-300 md:text-left">
            Dr Guinane Aicha <span className="text-stone-500">—</span>{" "}
            <span className="font-normal text-stone-200">{f("specialty")}</span>
          </p>

          {/* Bloc Centre - Toujours parfaitement centré */}
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {navLinks.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className="text-stone-200 transition-colors duration-200 hover:text-white"
              >
                {n(key)}
              </Link>
            ))}
          </nav>

          {/* Bloc Droite - Aligné à droite sur écran md */}
          <p className="text-sm text-stone-200 md:text-right">
            {i("address_line3")}
          </p>
        </div>

        {/* Ligne du bas (Copyright) */}
        <p className="mt-6 text-center text-xs text-stone-300">
          {f("copyright")}
        </p>
      </div>
    </footer>
  );
}
