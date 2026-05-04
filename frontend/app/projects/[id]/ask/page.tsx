"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { QuestionBox } from "@/components/QuestionBox";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { PaginatedQuestions, ProjectDetail } from "@/lib/types";

export default function AskProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [questions, setQuestions] = useState<PaginatedQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    const [projectDetail, questionHistory] = await Promise.all([
      api.getProject(projectId),
      api.listQuestions(projectId),
    ]);
    setProject(projectDetail);
    setQuestions(questionHistory);
  }

  useEffect(() => {
    loadData()
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load questions."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function ask(question: string) {
    await api.askQuestion(projectId, question);
    await loadData();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <ErrorMessage message={error} />
        {loading ? <LoadingSpinner label="Loading question workspace" /> : null}
        {project ? (
          <>
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <Link className="text-sm font-semibold text-moss" href={`/projects/${project.id}`}>
                Back to project
              </Link>
              <h1 className="mt-3 text-3xl font-bold text-ink">Ask about {project.name}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Answers are based on uploaded files and the latest completed analysis when available.
              </p>
              {!project.latest_analysis ? (
                <p className="mt-3 rounded-md bg-amber/20 px-3 py-2 text-sm text-ink">
                  No completed analysis exists yet. Questions will use uploaded files only.
                </p>
              ) : null}
            </section>
            <QuestionBox onAsk={ask} />
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-ink">Question history</h2>
                <Link href={`/projects/${project.id}`}>
                  <Button variant="ghost">Project details</Button>
                </Link>
              </div>
              {questions && questions.items.length === 0 ? (
                <EmptyState title="No questions yet" message="Ask the first question about this project." />
              ) : null}
              {questions?.items.map((item) => (
                <article className="rounded-lg border border-slate-200 bg-white p-5" key={item.id}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {formatDate(item.created_at)}
                  </p>
                  <h3 className="mt-2 whitespace-pre-wrap text-base font-semibold text-ink">{item.question}</h3>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {item.answer || "No answer saved."}
                  </p>
                </article>
              ))}
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
