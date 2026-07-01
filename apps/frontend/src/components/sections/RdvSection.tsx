"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Cal, { getCalApi } from "@calcom/embed-react";

const CAL_LINK = "drixou/consultation-pediatrique";
const CAL_ORIGIN = "https://calcom.drixou.uk";
const EMBED_JS_URL = `${CAL_ORIGIN}/embed/embed.js`;

export default function RdvSection() {
  const t = useTranslations("rdv");
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    (async function () {
      // Configuration de l'API avec les paramètres de ton instance locale
      const cal = await getCalApi({
        namespace: "consultation-pediatrique",
        embedJsUrl: EMBED_JS_URL,
      });

      cal("ui", {
        styles: { branding: { brandColor: "#0D9488" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!visible) {
        setVisible(true);
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    };

    window.addEventListener("open-rdv", handler);
    return () => window.removeEventListener("open-rdv", handler);
  }, [visible]);

  useEffect(() => {
    if (visible && !loaded) {
      setLoaded(true);
    }
  }, [visible, loaded]);

  if (!visible) return null;

  return (
    <section
      id="rdv"
      ref={sectionRef}
      className="scroll-mt-24 bg-gradient-to-b from-cream-100 to-white px-4 py-20 md:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-container">
        <h2 className="text-center font-heading text-3xl font-bold text-stone-800 md:text-4xl">
          {t("title")}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-center text-lg text-stone-500">
          {t("subtitle")}
        </p>

        <div
          className="mx-auto mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
          style={{ maxWidth: "800px", width: "100%", minHeight: "600px" }}
        >
          {loaded && (
            <Cal
              namespace="consultation-pediatrique"
              calLink={CAL_LINK}
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{
                layout: "month_view",
              }}
              calOrigin={CAL_ORIGIN}
              embedJsUrl={EMBED_JS_URL}
            />
          )}
        </div>
      </div>
    </section>
  );
}
