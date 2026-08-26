"use client";

import Script from "next/script";
import { useState } from "react";

const consentKey = "destino-analytics-consent";

export function ConsentAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consent, setConsent] = useState<"pending" | "accepted" | "declined">(() => {
    if (typeof window === "undefined") {
      return "pending";
    }

    const stored = window.localStorage.getItem(consentKey);
    if (stored === "accepted" || stored === "declined") {
      return stored;
    }

    return "pending";
  });

  const updateConsent = (value: "accepted" | "declined") => {
    window.localStorage.setItem(consentKey, value);
    setConsent(value);
  };

  if (!gaId) {
    return null;
  }

  return (
    <>
      {gaId && consent === "accepted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="destino-ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {consent === "pending" ? (
        <div className="fixed bottom-4 left-4 z-40 max-w-sm rounded-lg border border-[#DED7CF] bg-[#FCFBF8] p-4 text-sm shadow-sm">
          <p className="leading-6 text-[#29282D]">
            Destino can use privacy-conscious analytics to understand website
            performance after launch.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              className="h-10 rounded-[4px] bg-[#202238] px-4 text-sm font-semibold text-white hover:bg-[#C56545]"
              onClick={() => updateConsent("accepted")}
              type="button"
            >
              Allow
            </button>
            <button
              className="h-10 rounded-[4px] border border-[#DED7CF] px-4 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
              onClick={() => updateConsent("declined")}
              type="button"
            >
              Decline
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
