"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.question}
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
              isOpen ? "border-[#C56545] shadow-md" : "border-[#F5F1EA] hover:border-[#E6DDD1]"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between p-6 text-left focus:outline-none sm:px-8 sm:py-6"
              aria-expanded={isOpen}
            >
              <h3 className="text-[17px] font-bold text-[#1E3A8A]">
                {faq.question}
              </h3>
              <ChevronDown
                className={`ml-4 h-5 w-5 shrink-0 text-[#C56545] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-[15px] leading-relaxed text-[#625f5a] sm:px-8 sm:pb-8">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
