"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LeadForm } from "@/components/lead-form";

export function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-[#FCFBF8] py-20 md:py-32 border-t border-[#E6DDD1]" id="quote">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C56545] mb-4">
          Consultation
        </p>
        <h2 className="text-3xl font-bold leading-tight text-[#C56545] md:text-5xl mb-6">
          Ready to transform your space?
        </h2>
        <p className="text-lg leading-relaxed text-[#4F4B4A] max-w-2xl mx-auto">
          Share your product list, project room, or custom furniture brief. Our team will respond quickly with the next steps for a verified quotation.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-[#C56545] px-10 text-base font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#A44C30] focus:outline-none focus:ring-4 focus:ring-[#C56545]/30"
        >
          Request a Quotation
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#202238]/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[95vh] flex flex-col">
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-[#4F4B4A] hover:bg-[#EBEBEB] hover:text-[#202238] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 sm:p-10 pt-14">
              <LeadForm intent="quote" sourcePath="/" title="Request a quotation" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
