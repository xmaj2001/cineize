export function HeaderMovieSkeleton() {
  return (
    <header className="relative w-full overflow-hidden bg-background animate-pulse">
      {/* Simulation of the background backdrop */}
      <div className="absolute inset-0 z-0 bg-muted/20" />

      {/* Gradient masks */}
      <div className="absolute inset-0 z-0 bg-linear-to-r from-background via-background/40 to-background/10" />
      <div className="absolute inset-0 z-0 bg-linear-to-t from-background via-transparent to-background/50" />

      {/* Main Grid structure matching HeaderMovieContent */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-10 md:pt-32 md:pb-16 grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-8 items-end">
        {/* Left Side: Details & Actions Skeleton */}
        <div className="flex flex-col gap-4 md:gap-5 w-full">
          {/* Main Title Skeleton */}
          <div className="h-9 sm:h-11 md:h-14 lg:h-16 bg-muted rounded-xl w-3/4" />

          {/* Metadata Row Skeleton (Genres) */}
          <div className="flex items-center gap-3">
            <div className="h-4 bg-muted rounded-md w-32" />
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="h-4 bg-muted rounded-md w-20" />
          </div>

          {/* Release & Director Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-4 bg-muted rounded-md w-36" />
            <div className="h-4 bg-muted rounded-md w-28" />
          </div>

          {/* Synopsis Paragraph Skeleton */}
          <div className="flex flex-col gap-2 max-w-2xl pt-1">
            <div className="h-4 bg-muted rounded-md w-full" />
            <div className="h-4 bg-muted rounded-md w-11/12" />
            <div className="h-4 bg-muted rounded-md w-4/5" />
          </div>

          {/* Actions / Buttons Skeleton */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-10 bg-muted rounded-full w-36" />
            <div className="h-10 bg-muted rounded-full w-32" />
          </div>
        </div>

        {/* Right Side: Poster Skeleton (hidden on small screens, aspect 2/3) */}
        <div className="hidden md:block relative aspect-2/3 w-full rounded-2xl bg-muted border border-border/40 shadow-2xl" />
      </div>

      {/* Visual Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-3 dot-divider opacity-20 z-20" />
    </header>
  );
}