"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import type { FileDraft } from "@/lib/types";

export function CodeFileInput({
  file,
  index,
  onChange,
  onRemove,
}: {
  file: FileDraft;
  index: number;
  onChange: (index: number, file: FileDraft) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">File {index + 1}</h3>
        <Button type="button" variant="ghost" onClick={() => onRemove(index)}>
          Remove
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Input
          label="Path"
          placeholder="src/App.tsx"
          value={file.path}
          onChange={(event) => onChange(index, { ...file, path: event.target.value })}
        />
        <Input
          label="Language"
          placeholder="TypeScript"
          value={file.language}
          onChange={(event) => onChange(index, { ...file, language: event.target.value })}
        />
      </div>
      <Textarea
        label="Content"
        className="min-h-44 font-mono"
        value={file.content}
        onChange={(event) => onChange(index, { ...file, content: event.target.value })}
      />
    </div>
  );
}
