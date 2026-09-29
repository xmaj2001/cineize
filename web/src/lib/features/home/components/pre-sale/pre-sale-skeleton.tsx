import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FeedMovieCardSkeleton } from "../coming-soon/coming-soon-skeleton";

export function PreSaleSkeleton() {
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