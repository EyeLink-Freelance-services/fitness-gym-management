export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 p-6 dark:from-dark dark:via-dark dark:to-dark-2">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="space-y-3">
          <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-dark-3" />
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200 dark:bg-dark-3" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 to-transparent" />
            <div className="relative space-y-4">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-dark-3" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-2xl bg-slate-100 dark:bg-dark"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="relative space-y-5">
                <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-dark-3" />
                <div className="space-y-4">
                  <div className="h-10 animate-pulse rounded-2xl bg-slate-100 dark:bg-dark" />
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-dark" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-stroke/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-dark-3 dark:bg-dark-2/80">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="relative space-y-4">
                <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-dark-3" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-dark"
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}