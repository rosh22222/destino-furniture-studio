"use client";

import { PhoneCall } from "lucide-react";

import { siteConfig } from "@/lib/constants";
import { whatsappUrl } from "@/lib/whatsapp";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Call Button */}
      <a
        aria-label="Call Destino Furniture Studio"
        className="group flex h-14 max-w-[56px] items-center justify-start overflow-hidden rounded-full bg-white text-[#1E3A8A] shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 ease-out hover:max-w-[200px] hover:bg-[#1E3A8A] hover:text-white"
        href={`tel:${siteConfig.phoneHref}`}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center">
          <PhoneCall aria-hidden="true" className="h-[22px] w-[22px]" />
        </div>
        <span className="whitespace-nowrap pr-6 text-[15px] font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Call Us
        </span>
      </a>

      {/* WhatsApp Button */}
      <div className="relative">
        {/* Pulse effect fixed to the icon size */}
        <span className="absolute left-0 top-0 -z-10 h-14 w-14 animate-ping rounded-full bg-[#25D366] opacity-75"></span>
        <a
          aria-label="WhatsApp Destino Furniture Studio"
          className="group flex h-14 max-w-[56px] items-center justify-start overflow-hidden rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgb(37,211,102,0.3)] transition-all duration-500 ease-out hover:max-w-[200px]"
          href={whatsappUrl(
            "Hello Destino Furniture Studio, I would like to discuss a furniture requirement.",
          )}
          rel="noreferrer"
          target="_blank"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center">
            <WhatsAppIcon className="h-6 w-6" />
          </div>
          <span className="whitespace-nowrap pr-6 text-[15px] font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            WhatsApp Us
          </span>
        </a>
      </div>
    </div>
  );
}

