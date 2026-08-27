import { LogoCloud } from "@/components/logo-cloud";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getBrands, getClients } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Clients and Partners",
  description:
    "View client organizations and channel partners represented in Destino Furniture Studio's furniture portfolio.",
  path: "/clients",
  image: "/images/pages/clients/hero-workstations.jpeg",
});

export default async function ClientsPage() {
  const [clients, brands] = await Promise.all([getClients(), getBrands()]);
  const sectors = [...new Set(clients.map((client) => client.sector))].sort();

  return (
    <>
      <PageHero
        breadcrumbs={[{ name: "Clients", href: "/clients" }]}
        eyebrow="Clients"
        image="/images/pages/clients/hero-workstations.jpeg"
        title="Clients and partner brands in one clean portfolio view"
      >
        <p>
          Logos are balanced on a neutral background, and unavailable logos fall
          back to clear text instead of low-quality crops.
        </p>
      </PageHero>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Channel partners"
            title="HOF, Spacewood and Paradise Furniture"
          />
          <div className="mx-auto mt-8 max-w-4xl">
            <LogoCloud items={brands} />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EA] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Client portfolio"
            title="Organizations represented in the existing Destino portfolio"
          >
            <p>
              This section preserves client names found in the previous website
              while allowing the admin panel to manage logos, order and status.
            </p>
          </SectionHeading>
          <div className="mt-8">
            <LogoCloud items={clients} />
          </div>
        </div>
      </section>

      <section className="bg-[#FCFBF8] py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Sectors" title="Client sectors shown" />
          <div className="mt-6 flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <span
                className="rounded-[4px] border border-[#DED7CF] bg-[#FCFBF8] px-4 py-2 text-sm font-semibold text-[#202238]"
                key={sector}
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

