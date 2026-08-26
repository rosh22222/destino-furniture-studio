import Image from "next/image";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  image?: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
};

export function PageHero({
  eyebrow,
  title,
  children,
  image,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#202238] text-white">
      {image ? (
        <>
          <Image
            alt={title}
            className="object-cover opacity-42"
            fill
            priority
            sizes="100vw"
            src={image}
          />
          <div className="absolute inset-0 bg-[#202238]/52" />
        </>
      ) : null}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {breadcrumbs ? (
          <div className="mb-8 [&_a]:text-[#DED7CF] [&_span]:text-white">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#C56545]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          {title}
        </h1>
        {children ? (
          <div className="mt-5 max-w-3xl text-lg leading-8 text-[#F5F1EA]">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

