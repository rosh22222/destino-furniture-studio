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
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#4F5E5A]">
              Trusted by distinguished organizations and supported by reputed
              channel partners for premium furniture solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Channel Partners Section */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#F5F1EA] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(32,34,56,0.05)] sm:p-12 lg:p-16">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-[#1E3A8A] sm:text-3xl">
              Strategic Channel Partners
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-[#C56545]" />
            <p className="mt-4 text-sm font-medium text-[#625f5a]">
              Collaborating with India's most reputed manufacturers to deliver uncompromising quality.
            </p>
          </div>
          <LogoCloud items={brands} variant="partners" />
        </div>
      </section>

      {/* Client Portfolio Marquee Section */}
      <section className="mt-24 overflow-hidden py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1E3A8A] sm:text-3xl">
            Our Distinguished Clients
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-[#C56545]" />
          <p className="mt-4 text-sm font-medium text-[#625f5a]">
            Organizations that have transformed their workspaces with Destino.
          </p>
        </div>
        <div className="mt-12 w-full">
          <LogoCloud items={clients} variant="clients" />
        </div>
      </section>

      {/* Sectors Section */}
      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#F5F1EA] bg-white p-8 text-center shadow-sm sm:p-12">
          <h2 className="text-xl font-bold text-[#1E3A8A] sm:text-2xl">
            Industries We Serve
          </h2>
          <p className="mt-3 text-sm text-[#625f5a]">
            Delivering tailored furnishing solutions across diverse sectors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {sectors.map((sector) => (
              <span
                key={sector}
                className="cursor-default rounded-full bg-[#F5F1EA] px-6 py-2.5 text-sm font-bold tracking-wide text-[#1E3A8A] transition-all hover:-translate-y-1 hover:bg-[#1E3A8A] hover:text-white hover:shadow-lg hover:shadow-[#1E3A8A]/20"
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
