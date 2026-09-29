import { Skeleton } from "@/components/ui/skeleton";

export function SessionDetailSkeleton() {
  return (
    <header className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-background pt-20 pb-12 md:pt-28 md:pb-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-8 md:gap-12 items-center">
        {/* Esquerda Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-12 w-3/4 sm:w-1/2 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>

          <Skeleton className="h-20 w-80 rounded-2xl" />

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-64 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-12 w-44 rounded-full" />
          </div>
        </div>

        {/* Direita Poster Skeleton */}
        <div className="hidden md:block aspect-[2/3] w-full max-w-[280px] justify-self-end rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </header>
  );
}
