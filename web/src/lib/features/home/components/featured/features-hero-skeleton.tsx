export function FeaturesHeroSkeleton() {
  return (
    <section className="w-full pb-8 relative animate-pulse">
      <div className="relative aspect-21/9 min-h-125 w-full overflow-hidden bg-muted/30">
        {/* Container Simulado */}
        <div className="absolute inset-0 grid max-w-7xl mx-auto px-4 md:px-8 z-10 items-center py-12 md:grid-cols-[1fr_280px] gap-8">
          {/* Lado Esquerdo: Metadados e Título */}
          <div className="flex flex-col justify-center gap-4">
            {/* Linha Decorativa */}
            <div className="h-3 w-32 bg-muted/60 rounded" />

            {/* Título */}
            <div className="space-y-2">
              <div className="h-10 md:h-12 w-3/4 bg-muted/80 rounded-md" />
              <div className="h-10 md:h-12 w-1/2 bg-muted/60 rounded-md" />
            </div>

            {/* Metadados (Géneros, Duração, Classificação) */}
            <div className="flex items-center gap-3 pt-2">
              <div className="h-5 w-24 bg-muted/60 rounded" />
              <div className="h-5 w-16 bg-muted/40 rounded" />
              <div className="h-6 w-12 bg-muted/60 rounded-md" />
            </div>

            {/* Sinopse */}
            <div className="space-y-2 my-2 max-w-xl">
              <div className="h-4 w-full bg-muted/50 rounded" />
              <div className="h-4 w-5/6 bg-muted/50 rounded" />
              <div className="h-4 w-2/3 bg-muted/40 rounded" />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-44 bg-muted/70 rounded-full" />
              <div className="h-12 w-40 bg-muted/40 rounded-full" />
            </div>
          </div>

          {/* Lado Direito: Poster */}
          <div className="hidden md:block relative aspect-2/3 w-full rounded-2xl bg-muted/60 border-2 border-border/20 shadow-2xl" />
        </div>
      </div>
    </section>
  );
}