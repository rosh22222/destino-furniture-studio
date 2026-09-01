import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import type { Category } from "@/lib/types";

export function Footer({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <footer className="bg-white py-16 text-[#1E3A8A] border-t border-[#E6DDD1]">
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
            <p className="text-sm font-medium leading-relaxed max-w-[280px] mb-6">
              Your premier destination for quality furniture and home decor. Creating comfortable spaces since 1969.
            </p>
            <h3 className="text-lg font-bold mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#C56545] transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="hover:text-[#C56545] transition-colors">
                <svg
                  className="h-5 w-5"
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
              <a href="#" className="hover:text-[#C56545] transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <h3 className="text-[17px] font-bold mb-5">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-[14px] font-medium">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <h3 className="text-[17px] font-bold mb-5">Customer Service</h3>
            <ul className="flex flex-col gap-3 text-[14px] font-medium">
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/store-locator" className="hover:underline">Store Locator</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:underline">Terms and Conditions</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col">
            <h3 className="text-[17px] font-bold mb-5">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-[14px] font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Visakhapatnam | Kakinada |<br />Hyderabad</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+91 9948191991</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <span>sales@destinofurniture.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom */}
        <div className="mt-20 text-center text-[13px] font-medium">
          &copy; {new Date().getFullYear()} Destino Furniture Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
