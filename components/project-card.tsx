import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-[#E6DDD1] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1E3A8A]/5">
      <Link className="block" href={`/projects/${project.slug}`}>
        <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F1EA]">
          {project.coverImage ? (
            <Image
              alt={`${project.title} project by Destino Furniture Studio`}
              className="object-cover transition duration-500 group-hover:scale-[1.05]"
              fill
              priority={priority}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              src={project.coverImage}
            />
          ) : project.coverVideo ? (
            <div className="flex h-full w-full items-center justify-center bg-[#202238] text-white">
              <Play aria-hidden="true" className="h-10 w-10" />
            </div>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-col justify-between p-6">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#C56545]">
            {project.sector} <span className="mx-1 text-gray-300">|</span> {project.location}
          </div>
          <h3 className="mt-2 text-xl font-bold text-[#202238]">
            <Link className="hover:text-[#C56545] transition-colors" href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-2 text-lg font-medium leading-relaxed text-[#1E3A8A]">
            {project.description}
          </p>
        </div>
        <div className="mt-5">
          <Link
            className="inline-flex items-center gap-2 text-base font-bold text-[#202238] transition-colors hover:text-[#C56545]"
            href={`/projects/${project.slug}`}
          >
            View case study <ArrowRight aria-hidden="true" className="h-[14px] w-[14px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
