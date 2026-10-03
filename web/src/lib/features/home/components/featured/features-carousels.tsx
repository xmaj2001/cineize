"use client";

import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import { FeaturedMovieItem } from "../../type";
import { TrailerModal } from "@/components/TrailerModal";
import { FeaturedCarouselItem } from "./feature-carousel-Item";

interface FeaturesCarouselProps {
  features: FeaturedMovieItem[];
  lang: string;
  dict: any;
}

export function FeaturesCarousel({
  features,
  lang,
  dict,
}: FeaturesCarouselProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<FeaturedMovieItem | null>(
    null,
  );

  const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));

  if (!features || features.length === 0) {
    return null;
  }

  const handleTrailerClick = (movie: FeaturedMovieItem) => {
    setSelectedMovie(movie);
    setIsTrailerOpen(true);
  };

  return (
    <section className="w-full pb-8 relative">
      <Carousel
        plugins={[plugin.current as any]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent className="ml-0">
          {features.map((movie) => (
            <FeaturedCarouselItem
              key={movie.id}
              movie={movie}
              lang={lang}
              dict={dict}
              onTrailerClick={handleTrailerClick}
            />
          ))}
        </CarouselContent>
      </Carousel>

      {isTrailerOpen && selectedMovie?.trailerUrl && (
        <TrailerModal
          trailerUrl={selectedMovie.trailerUrl}
          movieTitle={selectedMovie.title}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </section>
  );
}