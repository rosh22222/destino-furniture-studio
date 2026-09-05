import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  ArrowRight,
  Handshake,
  Phone,
  Store,
  TrendingUp,
} from "lucide-react";

import { LeadForm } from "@/components/lead-form";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "Franchise",
  description:
    "Franchise and partnership enquiries for Destino Furniture Studio.",
  path: "/franchise",
});

const franchiseBenefits = [
  {
    title: "Premium Furniture Range",
    icon: Armchair,
  },
  {
    title: "Showroom Support",
    icon: Store,
  },
  {
    title: "Brand Partnership",
    icon: Handshake,
  },
  {
    title: "Growth Opportunity",
    icon: TrendingUp,
  },
];

export default function FranchisePage() {
  return (
    <main className="bg-[#FBFAF7] pb-20 text-[#1E3A8A]">
      <section className="border-b border-[#E6DDD1] bg-[#F6EFE6]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.42em] text-[#B9854F]">
              Partner with Destino
            </span>
            <h1 className="mt-5 [font-family:var(--font-collection-heading)] text-5xl font-extrabold uppercase tracking-[0.04em] text-[#026670] sm:text-6xl">
              Franchise
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#1E3A8A]">
              Destino Furniture Studio welcomes franchise, dealership and
              regional partnership enquiries from serious business partners who
              want to build a premium furniture presence in their market.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex min-h-[52px] min-w-[150px] items-center justify-center gap-2 rounded-full border border-[#026670] bg-[#026670] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(2,102,112,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C56545] hover:bg-[#C56545] hover:shadow-[0_18px_38px_rgba(197,101,69,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#026670]"
                href="#franchise-enquiry"
              >
                Apply
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border border-[#026670]/30 bg-white px-6 text-sm font-extrabold uppercase tracking-[0.16em] text-[#026670] transition hover:border-[#C56545] hover:text-[#C56545]"
                href={whatsappUrl(
                  "Hello Destino Furniture Studio, I would like to know about franchise opportunities.",
                )}
                rel="noreferrer"
                target="_blank"
              >
                WhatsApp
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative h-[300px] overflow-hidden rounded-[8px] bg-white shadow-[0_18px_48px_rgba(30,58,138,0.12)] sm:h-[380px] lg:h-[430px]">
            <Image
              alt="Destino Furniture Studio franchise showroom"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              src="/images/about/about1.png"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:items-center lg:px-8 lg:py-20">
        <div className="relative h-[320px] overflow-hidden rounded-[4px] bg-white shadow-[0_18px_46px_rgba(30,58,138,0.12)] sm:h-[420px] lg:h-[480px]">
          <Image
            alt="Destino franchise business opportunity"
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            src="/images/about/about1.png"
          />
        </div>

        <div>
          <h2 className="[font-family:var(--font-collection-heading)] text-3xl font-extrabold uppercase leading-tight tracking-[0.04em] text-[#026670] sm:text-4xl lg:text-[42px]">
            Why Become a Destino Franchise?
          </h2>

          <div className="mt-12 grid gap-x-14 gap-y-12 sm:grid-cols-2">
            {franchiseBenefits.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title}>
                  <Icon className="h-12 w-12 text-[#1E3A8A]" />
                  <h3 className="mt-5 text-xl font-extrabold text-[#111827]">
                    {item.title}
                  </h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        id="franchise-enquiry"
      >
        <LeadForm
          intent="general"
          sourcePath="/franchise"
          title="Franchise enquiry"
        />
      </section>
    </main>
  );
}
