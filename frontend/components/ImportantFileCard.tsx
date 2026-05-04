import type { ImportantFile } from "@/lib/types";

export function ImportantFileCard({ file }: { file: ImportantFile }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="font-mono text-sm font-semibold text-moss">{file.path}</p>
      <p className="mt-2 text-sm font-semibold text-ink">{file.reason}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{file.what_it_does}</p>
    </div>
  );
}
