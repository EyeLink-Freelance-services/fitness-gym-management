export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-4 h-6 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-3 h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="space-y-3">
            <div className="h-12 animate-pulse rounded bg-slate-100" />
            <div className="h-12 animate-pulse rounded bg-slate-100" />
            <div className="h-12 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="mb-4 h-6 w-52 animate-pulse rounded bg-slate-200" />
          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded bg-slate-100" />
            <div className="h-24 animate-pulse rounded bg-slate-100" />
            <div className="h-10 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}