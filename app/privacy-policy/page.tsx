import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy policy for Destino Furniture Studio website enquiries, quotation requests, wishlist storage and analytics consent.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-[#FCFBF8]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: "Privacy Policy", href: "/privacy-policy" }]}
        />
        <h1 className="mt-10 text-4xl font-semibold text-[#202238]">
          Privacy Policy
        </h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-[#625f5a]">
          <p>
            Destino Furniture Studio collects enquiry details that customers
            choose to submit, including name, phone, email, company, location,
            selected products and message content.
          </p>
          <p>
            Wishlist data is stored on the visitor&apos;s own device and is not sent
            to Destino unless the visitor submits a quotation request or opens a
            WhatsApp enquiry with those products.
          </p>
          <p>
            Supabase is used for database, authentication and storage when
            configured. Analytics load only after visitor consent and require a
            Google Analytics measurement ID.
          </p>
          <p>
            Customers can request enquiry follow-up or correction by contacting
            sales@destinofurniture.com.
          </p>
        </div>
      </div>
    </section>
  );
}
