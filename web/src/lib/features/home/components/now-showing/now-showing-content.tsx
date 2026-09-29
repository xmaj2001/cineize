import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getNowShowingMovies } from "../../queries";
import { FeedMovieCard } from "@/lib/features/movies/components/feeds/feed-movie-card";

interface NowShowingContentProps {
  lang: string;
}

export async function NowShowingContent({ lang }: NowShowingContentProps) {
  // Chamada de dados Server-Side direta
  const response = await getNowShowingMovies({ limit: 10 });

  // Validação do envelope NestJS (success + data)
  if (!response?.success || !response?.data?.items?.length) {
    return (
      <div className="py-8 text-center border border-dashed border-border/60 rounded-lg">
        <p className="text-sm font-mono text-muted-foreground">
          Nenhum filme em cartaz disponível de momento.
        </p>
      </div>
    );
  }

  const movies = response.data.items;

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-3 sm:-ml-4">
        {movies.map((movie) => (
          <CarouselItem
            key={movie.id}
            className="pl-3 sm:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4"
          >
            <FeedMovieCard movie={movie} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex -left-4" />
      <CarouselNext className="hidden md:flex -right-4" />
    </Carousel>
  );
}
