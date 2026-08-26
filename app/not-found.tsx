import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-[#FCFBF8]">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C56545]">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[#202238]">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-[#625f5a]">
          The page may have moved during the Destino website rebuild. Use the
          catalogue, projects or contact page to continue.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-12 items-center justify-center rounded-[4px] bg-[#202238] px-5 text-sm font-semibold text-white hover:bg-[#C56545]"
            href="/products"
          >
            View products
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-[4px] border border-[#DED7CF] px-5 text-sm font-semibold text-[#202238] hover:border-[#C56545]"
            href="/contact"
          >
            Contact Destino
          </Link>
        </div>
      </div>
    </section>
  );
}

