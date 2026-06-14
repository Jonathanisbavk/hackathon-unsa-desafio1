// Pantalla de carga compartida para los loading.tsx de cada segmento.
export default function PageLoading({ texto = "Cargando…" }: { texto?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 text-center">
      <span className="size-10 animate-spin rounded-full border-4 border-zinc-200 border-t-unsa-primary dark:border-zinc-700" />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400" aria-live="polite">
        {texto}
      </p>
    </div>
  );
}
