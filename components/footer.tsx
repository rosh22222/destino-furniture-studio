import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { navItems, siteConfig } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { whatsappUrl } from "@/lib/whatsapp";

export function Footer({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <footer className="border-t border-[#DED7CF] bg-[#202238] text-[#FCFBF8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="text-2xl font-extrabold uppercase tracking-[0.08em]">
            Destino
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C56545]">
            Furniture Studio
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#DED7CF]">
            A unit of Manidivya Enterprises, serving furniture enquiries across
            Visakhapatnam, Kakinada and Bengaluru.
          </p>
          <div className="mt-5 space-y-3 text-sm text-[#DED7CF]">
            <a
              className="flex items-center gap-3 hover:text-white"
              href={`tel:${siteConfig.phoneHref}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-[#C56545]" />
              {siteConfig.phoneDisplay}
            </a>
            <a
              className="flex items-center gap-3 hover:text-white"
              href={whatsappUrl(
                "Hello Destino Furniture Studio, I would like to discuss a furniture requirement.",
              )}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle
                aria-hidden="true"
                className="h-4 w-4 text-[#C56545]"
              />
              {siteConfig.whatsappDisplay}
            </a>
            <a
              className="flex items-center gap-3 hover:text-white"
              href={`mailto:${siteConfig.email}`}
            >
              <Mail aria-hidden="true" className="h-4 w-4 text-[#C56545]" />
              {siteConfig.email}
            </a>
            <p className="flex items-center gap-3">
              <MapPin aria-hidden="true" className="h-4 w-4 text-[#C56545]" />
              Visakhapatnam | Kakinada | Bengaluru
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C56545]">
            Navigate
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[#DED7CF]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C56545]">
            Products
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[#DED7CF]">
            {categories.slice(0, 8).map((category) => (
              <li key={category.slug}>
                <Link
                  className="hover:text-white"
                  href={`/products/${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C56545]">
            Enquiry
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[#DED7CF]">
            <li>
              <Link className="hover:text-white" href="/contact#quote">
                Request a quote
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/wishlist">
                Wishlist
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/contact">
                Contact Destino
              </Link>
            </li>
          </ul>
          <p className="mt-5 text-sm leading-6 text-[#DED7CF]">
            Enquiries served across Visakhapatnam, Kakinada and Bengaluru.
          </p>
          <div className="mt-6 flex gap-4 text-sm text-[#DED7CF]">
            <Link className="hover:text-white" href="/privacy-policy">
              Privacy
            </Link>
            <Link className="hover:text-white" href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[#DED7CF]">
        Copyright {new Date().getFullYear()} {siteConfig.name}. All rights
        reserved.
      </div>
    </footer>
  );
}
