"use client";

import { ChangeEvent } from "react";

import type { FileDraft } from "@/lib/types";

export function FileUpload({ onFiles }: { onFiles: (files: FileDraft[]) => void }) {
  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    const drafts = await Promise.all(
      selected.map(async (file) => ({
        path: file.webkitRelativePath || file.name,
        language: inferLanguage(file.name),
        content: await file.text(),
      })),
    );
    onFiles(drafts);
    event.target.value = "";
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-ink">Import text files</h3>
          <p className="mt-1 text-sm text-slate-600">Files are read in the browser and sent as plain text.</p>
        </div>
        <label>
          <input className="sr-only" type="file" multiple onChange={handleChange} />
          <span className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-mint px-4 py-2 text-sm font-semibold text-ink transition hover:bg-[#c6e5d8]">
            Choose files
          </span>
        </label>
      </div>
    </div>
  );
}

function inferLanguage(path: string) {
  const extension = path.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
    py: "Python",
    json: "JSON",
    md: "Markdown",
    css: "CSS",
    html: "HTML",
    go: "Go",
    rs: "Rust",
    java: "Java",
  };
  return extension ? map[extension] || extension.toUpperCase() : "";
}
