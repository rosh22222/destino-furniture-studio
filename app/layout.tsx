import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { SiteChrome } from "@/components/site-chrome";
import { siteConfig } from "@/lib/constants";
import { getCategories, getLocations, getProducts } from "@/lib/content";

import "./globals.css";

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: "Destino Furniture Studio | Office and Custom Furniture",
    template: "%s | Destino Furniture Studio",
  },
  description:
    "Premium office furniture, ergonomic chairs, custom furniture and commercial furniture solutions in Visakhapatnam, Kakinada and Bengaluru.",
  applicationName: siteConfig.name,
  generator: "Next.js",
  icons: {
    icon: "/icon.svg",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, locations, products] = await Promise.all([
    getCategories(),
    getLocations(),
    getProducts(),
  ]);

  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SiteChrome
          categories={categories}
          locations={locations}
          products={products}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
