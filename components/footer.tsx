import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import type { Category } from "@/lib/types";

export function Footer({
}: {
  categories: Category[];
}) {
  return (
    <footer className="border-t border-[#E6DDD1] bg-white py-16 text-[#026670]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Column 1 */}
          <div className="flex flex-col">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo/logo_destino.png"
                alt="Destino Furniture Studio Logo"
                width={200}
                height={58}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mb-7 max-w-[310px] text-base font-semibold leading-7">
              Your premier destination for quality furniture and home decor. Creating comfortable spaces since 2014.
            </p>
            <h3 className="mb-4 text-xl font-extrabold">Follow Us</h3>
            <div className="flex gap-5">
              <a
                href="https://www.instagram.com/destino_furniture_studio?igsi=ZG1uMDQ4azNzMXMy"
                className="transition-colors hover:text-[#C56545]"
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <h3 className="mb-5 text-xl font-extrabold">Quick Links</h3>
            <ul className="flex flex-col gap-3.5 text-base font-semibold">
              <li><Link href="/about" className="transition-colors hover:text-[#C56545] hover:underline">About Us</Link></li>
              <li><Link href="/franchise" className="transition-colors hover:text-[#C56545] hover:underline">Franchise</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <h3 className="mb-5 text-xl font-extrabold">Customer Service</h3>
            <ul className="flex flex-col gap-3.5 text-base font-semibold">
              <li><Link href="/faq" className="transition-colors hover:text-[#C56545] hover:underline">FAQ</Link></li>
              <li><Link href="/store-locator" className="transition-colors hover:text-[#C56545] hover:underline">Store Locator</Link></li>
              <li><Link href="/terms-and-conditions" className="transition-colors hover:text-[#C56545] hover:underline">Terms and Conditions</Link></li>
              <li><Link href="/privacy-policy" className="transition-colors hover:text-[#C56545] hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col">
            <h3 className="mb-5 text-xl font-extrabold">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-base font-semibold">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-6 w-6 shrink-0" />
                <span>Visakhapatnam | Kakinada |<br />Hyderabad</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-6 w-6 shrink-0" />
                <span>+91 9948191991</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-6 w-6 shrink-0" />
                <span>sales@destinofurniture.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom */}
        <div className="mt-20 text-center text-sm font-semibold">
          &copy; {new Date().getFullYear()} Destino Furniture Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
