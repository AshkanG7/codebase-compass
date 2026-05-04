import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft" href={`/projects/${project.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">{project.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {project.description || "No description added."}
          </p>
        </div>
        <span className="rounded-md bg-mint px-2 py-1 text-xs font-semibold text-moss">Project</span>
      </div>
      <p className="mt-5 text-xs font-medium text-slate-500">Created {formatDate(project.created_at)}</p>
    </Link>
  );
}
