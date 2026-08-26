import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms",
  description:
    "Terms for using the Destino Furniture Studio website, catalogue and quotation request flows.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <section className="bg-[#FCFBF8]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Terms", href: "/terms" }]} />
        <h1 className="mt-10 text-4xl font-semibold text-[#202238]">Terms</h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-[#625f5a]">
          <p>
            The Destino Furniture Studio website is an enquiry-focused catalogue.
            It does not provide checkout, online payment or guaranteed pricing.
          </p>
          <p>
            Product specifications, dimensions, finishes, availability, delivery
            scope and pricing must be confirmed by Destino before purchase or
            project commitment.
          </p>
          <p>
            Project photographs and client names are shown as portfolio records.
            Unverified awards, ratings, establishment years and street addresses
            are intentionally not published.
          </p>
          <p>
            Website content can be updated through the admin panel as confirmed
            business information becomes available.
          </p>
        </div>
      </div>
    </section>
  );
}

