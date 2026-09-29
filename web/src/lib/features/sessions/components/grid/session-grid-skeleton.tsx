export function SessionItemSkeleton() {
  return (
    <div className="session-card relative flex flex-col justify-between h-full p-4 border border-border/40 rounded-xl bg-card/50 animate-pulse">
      {/* Topo: Cinema */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="h-4 w-32 bg-muted/60 rounded" />
        <div className="h-4 w-12 bg-muted/40 rounded" />
      </div>

      {/* Centro: Horários e Formato */}
      <div className="my-2 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <div className="h-8 w-20 bg-muted/70 rounded" />
          <div className="h-3 w-16 bg-muted/40 rounded" />
        </div>
        <div className="h-6 w-10 bg-muted/60 rounded" />
      </div>

      {/* Rodapé: Preço e CTA */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/30">
        <div className="space-y-1">
          <div className="h-2.5 w-10 bg-muted/40 rounded" />
          <div className="h-5 w-16 bg-muted/60 rounded" />
        </div>
        <div className="h-4 w-20 bg-muted/50 rounded" />
      </div>
    </div>
  );
}

export function SessionsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SessionItemSkeleton key={i} />
      ))}
    </div>
  );
}
