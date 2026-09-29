import { Skeleton } from "@/components/ui/skeleton";

export function FeedMovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-2/3 w-full rounded-md bg-muted" />
      <div className="flex flex-wrap gap-1.5 mt-1">
        <Skeleton className="h-6 w-16 rounded-sm bg-muted" />
        <Skeleton className="h-6 w-20 rounded-sm bg-muted" />
        <Skeleton className="h-6 w-14 rounded-sm bg-muted" />
      </div>
    </div>
  );
}
