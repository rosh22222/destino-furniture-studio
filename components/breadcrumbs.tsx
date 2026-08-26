import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type BreadcrumbItem = {
  name: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const fullItems = [{ name: "Home", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-[#625f5a]">
        <ol className="flex flex-wrap items-center gap-2">
          {fullItems.map((item, index) => (
            <li className="flex items-center gap-2" key={item.href}>
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === fullItems.length - 1 ? (
                <span className="text-[#29282D]">{item.name}</span>
              ) : (
                <Link className="hover:text-[#C56545]" href={item.href}>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(fullItems)} />
    </>
  );
}

