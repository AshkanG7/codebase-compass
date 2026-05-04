import { ImportantFileCard } from "@/components/ImportantFileCard";
import type { Analysis, FirstFileToRead } from "@/lib/types";

export function AnalysisSection({ analysis }: { analysis: Analysis | null }) {
  if (!analysis) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">Analysis</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">No analysis has been run yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">Latest analysis</h2>
        <span className="rounded-md bg-mint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-moss">
          {analysis.status}
        </span>
      </div>
      {analysis.error_message ? <p className="text-sm text-red-700">{analysis.error_message}</p> : null}
      <PlainBlock title="Summary" value={analysis.summary} />
      <PlainList title="Detected stack" items={analysis.detected_stack || []} />
      <PlainBlock title="Architecture" value={analysis.architecture} />
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Important files</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {(analysis.important_files || []).map((file) => (
            <ImportantFileCard file={file} key={`${file.path}-${file.reason}`} />
          ))}
        </div>
      </div>
      <PlainBlock title="How to run" value={analysis.how_to_run} />
      <PlainBlock title="Data flow" value={analysis.data_flow} />
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Risks or confusing parts</h3>
        <div className="mt-3 space-y-3">
          {(analysis.risky_or_confusing_parts || []).map((part) => (
            <div className="rounded-md border border-slate-200 bg-paper p-4" key={`${part.issue}-${part.suggestion}`}>
              <p className="font-semibold text-ink">{part.issue}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{part.why_it_matters}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-moss">{part.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
      <FirstFilesToReadSection files={analysis.first_files_to_read || []} />
      <PlainList title="Suggested next steps" items={analysis.suggested_next_steps || []} />
    </section>
  );
}

function FirstFilesToReadSection({ files }: { files: FirstFileToRead[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">First files to read</h3>
      {files.length ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {files.map((file) => (
            <div className="rounded-md border border-slate-200 bg-white p-4" key={`${file.path}-${file.reason}`}>
              <p className="font-mono text-sm font-semibold text-moss">{file.path}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{file.reason}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-600">Not available.</p>
      )}
    </div>
  );
}

function PlainBlock({ title, value }: { title: string; value: string | null | undefined }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{value || "Not available."}</p>
    </div>
  );
}

function PlainList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {items.length ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <li className="rounded-md bg-mint px-3 py-1 text-sm font-medium text-moss" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-600">Not available.</p>
      )}
    </div>
  );
}
