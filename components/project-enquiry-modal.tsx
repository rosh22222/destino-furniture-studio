"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { LeadForm } from "@/components/lead-form";

type ProjectEnquiryModalProps = {
  projectTitle: string;
  projectSlug: string;
};

export function ProjectEnquiryModal({ projectTitle, projectSlug }: ProjectEnquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#202238] px-8 py-4 text-[15px] font-bold tracking-wide text-white transition-all hover:-translate-y-1 hover:bg-[#C56545] hover:shadow-xl hover:shadow-[#C56545]/20"
      >
        <MessageSquare className="h-5 w-5" />
        Discuss this project type
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-[#202238]/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-[2rem] bg-white shadow-2xl transition-all">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F1EA] text-[#202238] transition-colors hover:bg-[#C56545] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-8 sm:p-12 text-left">
              <h3 className="mb-2 text-3xl font-bold text-[#202238]">Let's collaborate</h3>
              <p className="mb-8 text-[15px] leading-relaxed text-[#625f5a]">
                Share a few details and we'll get back to you with the next steps for a similar project.
              </p>
              <div className="[&>form>div:first-child]:hidden">
                {/* We hide the internal LeadForm title because we have our own premium one above */}
                <LeadForm
                  intent="project"
                  project={projectTitle}
                  sourcePath={`/projects/${projectSlug}`}
                  title=""
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
