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
    <article className="group overflow-hidden rounded-lg border border-[#DED7CF] bg-[#FCFBF8]">
      <Link className="block" href={`/projects/${project.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F1EA]">
          {project.coverImage ? (
            <Image
              alt={`${project.title} project by Destino Furniture Studio`}
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
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
      <div className="space-y-3 p-5">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b746e]">
          {project.sector} | {project.location}
        </div>
        <h3 className="text-lg font-semibold text-[#202238]">
          <Link className="hover:text-[#C56545]" href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-[#625f5a]">
          {project.description}
        </p>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#C56545] hover:text-[#202238]"
          href={`/projects/${project.slug}`}
        >
          View case study <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

