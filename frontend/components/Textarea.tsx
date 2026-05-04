import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <textarea
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-moss focus:ring-2 focus:ring-mint ${className}`}
        {...props}
      />
    </label>
  );
}
