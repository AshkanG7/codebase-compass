export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-mint border-t-moss" />
      <span>{label}</span>
    </div>
  );
}
