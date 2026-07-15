"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Cal, { getCalApi } from "@calcom/embed-react";
import type { CalComSettings } from "@/lib/payload";

const DEFAULT_CALCOM: CalComSettings = {
  eventSlug: "consultation-pediatrique",
  username: "drixou",
  customUrl: "https://calcom.drixou.uk",
}

export default function RdvSection({ calcom }: { calcom?: CalComSettings | null }) {
  const c = calcom?.eventSlug ? calcom : DEFAULT_CALCOM
  const eventSlug = c.eventSlug || "consultation-pediatrique"
  const username = c.username || "drixou"
  const customUrl = c.customUrl || "https://calcom.drixou.uk"
  const calLink = `${username}/${eventSlug}`
  const embedJsUrl = `${customUrl}/embed/embed.js`

  const t = useTranslations("rdv");
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({
        namespace: eventSlug,
        embedJsUrl,
      });

      cal("ui", {
        styles: { branding: { brandColor: "#0D9488" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [eventSlug, embedJsUrl]);

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

  return (
    <>
      <div id="rdv" />
      {visible && (
        <section
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
                  namespace={eventSlug}
                  calLink={calLink}
                  style={{ width: "100%", height: "100%", overflow: "scroll" }}
                  config={{ layout: "month_view" }}
                  calOrigin={customUrl}
                  embedJsUrl={embedJsUrl}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
