"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/Button";
import { CodeFileInput } from "@/components/CodeFileInput";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FileUpload } from "@/components/FileUpload";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { api } from "@/lib/api";
import type { FileDraft } from "@/lib/types";

const emptyFile: FileDraft = { path: "", language: "", content: "" };

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileDraft[]>([{ ...emptyFile }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateFile(index: number, file: FileDraft) {
    setFiles((current) => current.map((item, itemIndex) => (itemIndex === index ? file : item)));
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function addImportedFiles(imported: FileDraft[]) {
    setFiles((current) => {
      const withoutEmpty = current.filter((file) => file.path || file.content || file.language);
      return [...withoutEmpty, ...imported];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const project = await api.createProject({ name, description: description || undefined });
      const uploadableFiles = files.filter((file) => file.path.trim() && file.content.trim());
      if (uploadableFiles.length > 0) {
        await api.addFiles(project.id, uploadableFiles);
      }
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-ink">Create project</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Paste source files or import text files. The backend will enforce file type, size, and safety limits.
        </p>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
            <Input label="Project name" required value={name} onChange={(event) => setName(event.target.value)} />
            <Textarea
              label="Description"
              className="min-h-24"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </section>
          <FileUpload onFiles={addImportedFiles} />
          <section className="space-y-4">
            {files.map((file, index) => (
              <CodeFileInput
                file={file}
                index={index}
                key={`${index}-${file.path}`}
                onChange={updateFile}
                onRemove={removeFile}
              />
            ))}
          </section>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={() => setFiles((current) => [...current, { ...emptyFile }])}>
              Add file
            </Button>
            <Button disabled={loading || !name.trim()}>{loading ? "Creating..." : "Create project"}</Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
