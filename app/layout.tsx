import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";

import { SiteChrome } from "@/components/site-chrome";
import { siteConfig } from "@/lib/constants";
import { getCategories, getProducts } from "@/lib/content";

import "./globals.css";

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
});

const cinzel = Cinzel({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-collection-heading",
  weight: ["700", "800"],
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
    icon: "/icon.png",
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
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <html lang="en" className={`${manrope.variable} ${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SiteChrome
          categories={categories}
          products={products}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
