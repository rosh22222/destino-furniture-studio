import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Destino Furniture Studio.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FCFBF8] py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#202238] sm:text-4xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-[#4F4B4A]">
          <p>
            At Destino Furniture Studio, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and physical address when you request a quotation or contact us. We also collect non-personally identifiable information automatically as you navigate through our site.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide you with the services and products you request, process quotations, improve our website, and communicate with you about your inquiries and our offerings.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">3. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the internet or method of electronic storage is 100% secure.
          </p>
          <h2 className="text-xl font-bold text-[#202238]">4. Contact Us</h2>
          <p>
            If you have any questions regarding this privacy policy, you may contact us at sales@destinofurniture.com.
          </p>
        </div>
      </div>
    </div>
  );
}
