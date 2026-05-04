import Link from "next/link";

import { Button } from "@/components/Button";

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{message}</p>
      {actionHref && actionLabel ? (
        <Link className="mt-5 inline-flex" href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  );
}
