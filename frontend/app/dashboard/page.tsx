"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProjectCard } from "@/components/ProjectCard";
import { api } from "@/lib/api";
import type { PaginatedProjects } from "@/lib/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<PaginatedProjects | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listProjects()
      .then(setProjects)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load projects."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">Projects</h1>
            <p className="mt-2 text-sm text-slate-600">Your saved codebase maps and analysis history.</p>
          </div>
          <Link href="/projects/new">
            <Button>New project</Button>
          </Link>
        </div>
        <div className="mt-6">
          <ErrorMessage message={error} />
          {loading ? <LoadingSpinner label="Loading projects" /> : null}
          {!loading && projects && projects.items.length === 0 ? (
            <EmptyState
              title="No projects yet"
              message="Create your first project, add source files, and run a secure codebase analysis."
              actionHref="/projects/new"
              actionLabel="Create project"
            />
          ) : null}
          {projects && projects.items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.items.map((project) => (
                <ProjectCard project={project} key={project.id} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
