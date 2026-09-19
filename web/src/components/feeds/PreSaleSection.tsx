"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MovieCard } from "../movies/MovieCard";
import { ApiMovie } from "@/lib/features/movies";

import { getDictionary } from "@/app/lib/dictionaries";

interface PreSaleSectionProps {
  lang?: string;
  movies: ApiMovie[];
}

export function PreSaleSection({ lang = "pt", movies }: PreSaleSectionProps) {
  const dict = getDictionary(lang);

  return (
    <section className="border-t border-border/40">
      {/* Cabeçalho da Secção */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            {dict.feeds.pre_sale}
          </h2>
        </div>
        <Link
          href={`/${lang}/movies?status=presale`}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          {dict.feeds.view_all}
        </Link>
      </div>

      {/* Carrossel */}
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
              <MovieCard movie={movie} lang={lang} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-4" />
        <CarouselNext className="hidden md:flex -right-4" />
      </Carousel>
    </section>
  );
}
