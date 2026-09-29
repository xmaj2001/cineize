import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function FeedMovieCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Poster Skeleton */}
      <div className="aspect-2/3 w-full rounded-md bg-muted/60 relative overflow-hidden">
        {/* Badges Fictícios */}
        <div className="absolute top-2 left-2 h-4 w-12 bg-muted/80 rounded-sm" />
        {/* Titulo/Info Overlay Skeleton */}
        <div className="absolute inset-x-0 bottom-0 p-3 space-y-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="h-2.5 w-16 bg-muted/40 rounded" />
          <div className="h-4 w-3/4 bg-muted/60 rounded" />
        </div>
      </div>

      {/* Botões de Sessões Skeleton */}
      <div className="mt-2.5 flex gap-1.5">
        <div className="h-5 w-16 bg-muted/40 rounded-sm" />
        <div className="h-5 w-16 bg-muted/40 rounded-sm" />
      </div>
    </div>
  );
}

export function ComingSoonSkeleton() {
  return (
    <Carousel opts={{ align: "start" }} className="w-full pointer-events-none">
      <CarouselContent className="-ml-3 sm:-ml-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CarouselItem
            key={i}
            className="pl-3 sm:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
          >
            <FeedMovieCardSkeleton />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
