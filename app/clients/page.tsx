import Image from "next/image";
import { LogoCloud } from "@/components/logo-cloud";
import { getBrands, getClients } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Clients and Partners",
  description:
    "Explore the distinguished organizations and channel partners that trust Destino Furniture Studio for their furnishing solutions.",
  path: "/clients",
  image: "/images/pages/clients/clients-hero-banner.png",
});

export default async function ClientsPage() {
  const [clients, brands] = await Promise.all([getClients(), getBrands()]);
  const sectors = [...new Set(clients.map((client) => client.sector))].sort();

  return (
    <main className="min-h-screen bg-[#FFF9F5] pb-24">
      <section className="pb-12 text-center">
        <div className="relative flex h-[300px] items-center justify-center overflow-hidden bg-[#F4EFE7] sm:h-[360px] lg:h-[411px]">
          <Image
            alt="Destino client portfolio banner"
            className="object-cover object-center"
            fill
            priority
            src="/images/pages/clients/clients-hero-banner.png"
          />
          <div className="absolute inset-0 bg-white/62" />
          <div className="relative max-w-3xl px-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.45em] text-[#B9854F]">
              Our network
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-none tracking-normal text-[#164E4A] sm:text-6xl lg:text-7xl">
              CLIENTS
            </h1>
            <p className="mt-2 text-4xl font-light italic leading-tight text-[#77746F] sm:text-5xl lg:text-6xl">
              & Partners.
            </p>
            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-[#4F5E5A] sm:text-xl">
              Trusted by distinguished organizations and supported by reputed
              channel partners for premium furniture solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Channel Partners Section */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#F5F1EA] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(32,34,56,0.05)] sm:p-10 lg:p-12">
          <div className="mb-8 text-center">
            <h2 className="[font-family:var(--font-collection-heading)] text-3xl font-extrabold uppercase leading-tight tracking-[0.05em] text-[#026670] sm:text-4xl">
              Strategic Channel Partners
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-[#C56545]" />
            <p className="mt-4 text-base font-medium leading-7 text-[#1E3A8A] sm:text-lg">
              Collaborating with India&apos;s most reputed manufacturers to deliver uncompromising quality.
            </p>
          </div>
          <LogoCloud items={brands} variant="partners" />
        </div>
      </section>

      {/* Client Portfolio Marquee Section */}
      <section className="mt-12 overflow-hidden bg-[#FFF3E0] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto inline-flex items-center gap-4">
            <span className="hidden h-px w-14 bg-[#C56545]/70 sm:block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.42em] text-[#C56545]">
              Trusted portfolio
            </span>
            <span className="hidden h-px w-14 bg-[#C56545]/70 sm:block" />
          </div>
          <h2 className="mx-auto mt-5 max-w-3xl [font-family:var(--font-collection-heading)] text-3xl font-extrabold uppercase leading-tight tracking-[0.05em] text-[#026670] sm:text-4xl md:text-5xl">
            Our Distinguished Clients
          </h2>
          <div className="mx-auto mt-5 h-0.5 w-24 bg-[#C56545]" />
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-[#1E3A8A] sm:text-xl">
            Organizations across public, retail, hospitality and workplace
            sectors that trust Destino for refined furniture solutions.
          </p>
        </div>
        <div className="mt-12 w-full">
          <LogoCloud items={clients} variant="clients" />
        </div>
      </section>

      {/* Sectors Section */}
      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#F5F1EA] bg-white p-8 text-center shadow-sm sm:p-12">
          <h2 className="[font-family:var(--font-collection-heading)] text-xl font-bold uppercase tracking-[0.05em] text-[#026670] sm:text-2xl">
            Industries We Serve
          </h2>
          <p className="mt-3 text-lg font-medium leading-8 text-[#1E3A8A] sm:text-xl">
            Delivering tailored furnishing solutions across diverse sectors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {sectors.map((sector) => (
              <span
                key={sector}
                className="cursor-default rounded-full bg-[#F5F1EA] px-7 py-3 text-base font-bold tracking-wide text-[#1E3A8A] transition-all hover:-translate-y-1 hover:bg-[#1E3A8A] hover:text-white hover:shadow-lg hover:shadow-[#1E3A8A]/20 sm:text-lg"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
