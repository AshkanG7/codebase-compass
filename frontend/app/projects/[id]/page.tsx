"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AnalysisSection } from "@/components/AnalysisSection";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";
import { formatBytes, formatDate } from "@/lib/format";
import type { ProjectDetail } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = Number(params.id);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProject() {
    setError(null);
    const detail = await api.getProject(projectId);
    setProject(detail);
  }

  useEffect(() => {
    loadProject()
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load project."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);
    try {
      await api.analyzeProject(projectId);
      await loadProject();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze project.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await api.deleteProject(projectId);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete project.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <ErrorMessage message={error} />
        {loading ? <LoadingSpinner label="Loading project" /> : null}
        {!loading && project ? (
          <>
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-moss">Created {formatDate(project.created_at)}</p>
                  <h1 className="mt-2 text-3xl font-bold text-ink">{project.name}</h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {project.description || "No description added."}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={`/projects/${project.id}/ask`}>
                    <Button variant="secondary">Ask questions</Button>
                  </Link>
                  <Button onClick={handleAnalyze} disabled={analyzing || project.files.length === 0}>
                    {analyzing ? "Analyzing..." : "Analyze Codebase"}
                  </Button>
                  <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-ink">Files</h2>
              {project.files.length === 0 ? (
                <div className="mt-4">
                  <EmptyState title="No files yet" message="Create a new project with files to run analysis." />
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {project.files.map((file) => (
                    <details className="rounded-md border border-slate-200 bg-paper p-4" key={file.id}>
                      <summary className="cursor-pointer font-mono text-sm font-semibold text-moss">
                        {file.path} <span className="font-sans text-slate-500">({formatBytes(file.size_bytes)})</span>
                      </summary>
                      <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-ink p-4 text-sm leading-6 text-mint">
                        {file.content}
                      </pre>
                    </details>
                  ))}
                </div>
              )}
            </section>
            <AnalysisSection analysis={project.latest_analysis} />
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
