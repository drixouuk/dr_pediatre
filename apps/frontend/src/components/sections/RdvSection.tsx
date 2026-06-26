"use client";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function RdvSection() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initCal = async () => {
      const cal = await getCalApi({
        embedJsUrl: "https://calcom.drixou.uk/embed/embed.js",
      });

      // Une fois l'iframe prête, on écoute les changements de hauteur
      cal("on", {
        action: "__dimensionChanged",
        callback: (event) => {
          const { iframeHeight, iframeWidth, isFirstTime } = event.detail.data;
          const iframe = document.querySelector(
            "iframe[data-cal-embed]"
          ) as HTMLIFrameElement;
          if (iframe && iframeHeight) {
            iframe.style.height = `${iframeHeight}px`;
          }
        },
      });

      // Nettoyage
      cleanup = () => {
        cal("off", { action: "__dimensionChanged", callback: () => {} });
      };
    };

    initCal();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto" style={{ minHeight: 600 }}>
      <Cal
        calLink="drixou/consultation-pediatrique"
        embedJsUrl="https://calcom.drixou.uk/embed/embed.js"
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
