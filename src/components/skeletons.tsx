// Placeholders de carga (animate-pulse) para dar feedback visual mientras se consulta.

export function OfertaCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-6 w-20 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-2 h-10 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

export function OfertasGridSkeleton({ n = 4 }: { n?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: n }).map((_, i) => (
        <OfertaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RecomendacionSkeleton({ n = 3 }: { n?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col gap-2 rounded-xl border border-indigo-100 bg-white p-4 dark:border-indigo-900/50 dark:bg-zinc-900"
        >
          <div className="h-4 w-3/4 rounded bg-indigo-100 dark:bg-indigo-900/40" />
          <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-3 w-1/3 rounded bg-indigo-100 dark:bg-indigo-900/40" />
        </div>
      ))}
    </div>
  );
}
