"use client";

import { MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/lib/constants";
import { whatsappUrl } from "@/lib/whatsapp";

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
      <a
        aria-label="Call Destino Furniture Studio"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#DED7CF] bg-[#FCFBF8] text-[#202238] shadow-sm transition hover:border-[#C56545] hover:text-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]"
        href={`tel:${siteConfig.phoneHref}`}
      >
        <Phone aria-hidden="true" className="h-5 w-5" />
      </a>
      <a
        aria-label="WhatsApp Destino Furniture Studio"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#202238] text-white shadow-sm transition hover:bg-[#C56545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C56545]"
        href={whatsappUrl(
          "Hello Destino Furniture Studio, I would like to discuss a furniture requirement.",
        )}
        rel="noreferrer"
        target="_blank"
      >
        <MessageCircle aria-hidden="true" className="h-5 w-5" />
      </a>
    </div>
  );
}

