import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description: "Terms and conditions for Destino Furniture Studio.",
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#FCFBF8] py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#202238] sm:text-4xl">Terms and Conditions</h1>
        <div className="mt-8 space-y-6 text-[#4F4B4A]">
          <p>
            Welcome to Destino Furniture Studio. By accessing or using our website, you agree to be bound by these Terms and Conditions.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">1. General</h2>
          <p>
            The content of the pages of this website is for your general information and use only. It is subject to change without notice.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">2. Products and Quotations</h2>
          <p>
            Product details, specifications, and availability are subject to change. Quotations are provided based on the specific requirements and do not constitute a binding offer until confirmed by our sales team.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">3. Intellectual Property</h2>
          <p>
            This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">4. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at sales@destinofurniture.com.
          </p>
        </div>
      </div>
    </div>
  );
}
