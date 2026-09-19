"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Clock,
  Play,
  Ticket,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getMoviesFormat } from "./utiles";
import { ApiMovie } from "@/lib/features/movies";
import { TrailerModal } from "./TrailerModal";

// Importando os dados e tipos fornecidos

import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

interface HeroProps {
  movies: ApiMovie[] | [];
  lang?: string;
}

interface HeroItemProps {
  movie: ApiMovie;
  lang?: string;
}

function HeroItem({ movie, lang: propLang }: HeroItemProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || "pt";
  const dict = getDictionary(lang);
  const formats = getMoviesFormat(movie.sessionMovies ?? []);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  return (
    <CarouselItem className="pl-0 relative group">
      {/* Container Principal com Backdrop */}
      <div className="relative aspect-21/9 min-h-125 w-full overflow-hidden bg-background">
        {/* Backdrop Imagem */}
        {movie.bannerUrl && (
          <Image
            src={movie.bannerUrl}
            alt={`Backdrop de ${movie.title}`}
            fill
            priority
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="100vw"
          />)
        }

        {/* Overlays Monocromáticos de Transição */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

        {/* Conteúdo */}
        <div className="absolute inset-0 grid max-w-7xl mx-auto px-4 md:px-8 z-10 items-center py-12 md:grid-cols-[1fr_280px] gap-8">
          <div className="flex flex-col justify-center gap-4 text-foreground">
            {/* Linha Decorativa + Estado do Filme */}
            <div className="mb-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span
                className="dotted-x flex-1 max-w-16 text-foreground/50"
                aria-hidden
              />
              {/* Estado dinâmico (Pré-venda / Em Cartaz) */}
              <span className="font-mono text-primary font-bold">
                {movie.status || dict.movies.hero.featured}
              </span>
              <span
                className="dotted-x flex-1 max-w-16 text-foreground/50"
                aria-hidden
              />
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight tracking-tighter text-foreground drop-shadow-sm">
              {movie.title}
            </h1>

            {/* Metadados e Formatos */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm md:text-base text-muted-foreground font-sans">
              <span className="font-bold text-foreground">
                {movie.genres.join(", ")}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {movie.durationMin} min
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="rounded bg-foreground/10 px-2 py-0.5 text-xs font-mono font-bold text-foreground border border-border">
                {movie.ageRating}
              </span>

              {/* Exemplo de Formatos de Exibição (Se existirem no teu mock) */}
              {formats && formats.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <div className="flex gap-1 font-mono text-xs">
                    {formats.map((fmt: string) => (
                      <span
                        key={fmt}
                        className="border border-border/80 px-1.5 py-0.5 rounded text-foreground/80"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sinopse */}
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed line-clamp-3 my-2">
              {movie.synopsis}
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={`/${lang}/movies/${movie.id}#cinemas`}
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm md:text-base font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 transform hover:-translate-y-0.5"
              >
                <Ticket className="h-5 w-5" /> {dict.movies.hero.buy_ticket}
              </Link>

              {movie.trailerUrl ? (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-sm md:text-base font-bold text-foreground transition hover:border-foreground/50 hover:bg-card"
                >
                  <Play className="h-5 w-5 fill-foreground" /> {dict.movies.hero.watch_trailer}
                </button>
              ) : (
                <Link
                  href={`/${lang}/movies/${movie.id}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-sm md:text-base font-bold text-foreground transition hover:border-foreground/50 hover:bg-card"
                >
                  <Play className="h-5 w-5 fill-foreground" /> {dict.movies.hero.view_details}
                </Link>
              )}
            </div>
          </div>

          {/* Poster do Filme (Lugar de destaque da cor) */}
          <div className="hidden md:block relative aspect-2/3 w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 group-hover:border-primary/50 transition-colors duration-500 transform rotate-1 group-hover:rotate-0">
            <Image
              src={movie.posterUrl}
              alt={`Poster de ${movie.title}`}
              fill
              className="object-cover"
              sizes="280px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white">
              <span className="text-xs font-medium bg-black/60 px-2 py-1 rounded backdrop-blur-sm tracking-wide">
                {movie.language?.toUpperCase() || "N/A"}
              </span>
              <span className="text-xs font-medium border border-white/40 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                {dict.movies.hero.subtitle_lang}: {movie.subtitleLanguage?.toUpperCase() || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-3 dot-divider opacity-30 z-20" />
      </div>

      {/* Modal Trailer */}
      {isTrailerOpen && movie.trailerUrl && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          movieTitle={movie.title}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </CarouselItem>
  );
}

export function Hero({ movies, lang }: HeroProps) {
  if (movies.length === 0) {
    return null;
  }

  const featuredMovies = movies;
  const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));

  if (featuredMovies.length === 0) {
    return null;
  }

  return (
    <section className="w-full pb-8">
      <Carousel
        plugins={[plugin.current as any]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent className="ml-0">
          {featuredMovies.map((movie) => (
            <HeroItem key={movie.id} movie={movie} lang={lang} />
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}


// "use client";

// import Autoplay from "embla-carousel-autoplay";
// import { Clock, Play, Ticket } from "lucide-react";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { ApiMovie } from "@/features/movies";
// import { getMoviesFormat } from "../movies/utiles";

// // Importando os dados e tipos fornecidos

// interface HeroProps {
//   movies: ApiMovie[];
//   lang: string;
// }

// export function Hero({ movies, lang }: HeroProps) {
//   const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));

//   if (movies.length === 0) {
//     return null;
//   }

//   return (
//     <section className="w-full pb-8">
//       <Carousel
//         plugins={[plugin.current as any]}
//         className="w-full"
//         opts={{ loop: true }}
//       >
//         <CarouselContent className="ml-0">
//           {movies.map((movie) => {
//             const formats = getMoviesFormat(movie);
//             return (
//               <CarouselItem key={movie.id} className="pl-0 relative group">
//                 {/* Container Principal com Backdrop */}
//                 <div className="relative aspect-21/9 min-h-125 w-full overflow-hidden bg-background">
//                   {/* Backdrop Imagem */}
//                   <Image
//                     src={movie.bannerUrl!}
//                     alt={`Backdrop de ${movie.title}`}
//                     fill
//                     priority
//                     className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
//                     sizes="100vw"
//                   />

//                   {/* Overlays Monocromáticos de Transição */}
//                   <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
//                   <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />

//                   {/* Conteúdo */}
//                   <div className="absolute inset-0 grid max-w-7xl mx-auto px-4 md:px-8 z-10 items-center py-12 md:grid-cols-[1fr_280px] gap-8">
//                     <div className="flex flex-col justify-center gap-4 text-foreground">
//                       {/* Linha Decorativa + Estado do Filme */}
//                       <div className="mb-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
//                         <span
//                           className="dotted-x flex-1 max-w-16 text-foreground/50"
//                           aria-hidden
//                         />
//                         {/* Estado dinâmico (Pré-venda / Em Cartaz) */}
//                         <span className="font-mono text-primary font-bold">
//                           {movie.status || "Em Destaque"}
//                         </span>
//                         <span
//                           className="dotted-x flex-1 max-w-16 text-foreground/50"
//                           aria-hidden
//                         />
//                       </div>

//                       {/* Título Principal */}
//                       <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight tracking-tighter text-foreground drop-shadow-sm">
//                         {movie.title}
//                       </h1>

//                       {/* Metadados e Formatos */}
//                       <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm md:text-base text-muted-foreground font-sans">
//                         <span className="font-bold text-foreground">
//                           {movie.genres?.join(", ")}
//                         </span>
//                         <span className="w-1 h-1 rounded-full bg-border" />
//                         <span className="flex items-center gap-1.5">
//                           <Clock className="h-4 w-4" /> {movie.durationMin} min
//                         </span>
//                         <span className="w-1 h-1 rounded-full bg-border" />
//                         <span className="rounded bg-foreground/10 px-2 py-0.5 text-xs font-mono font-bold text-foreground border border-border">
//                           {movie.ageRating}
//                         </span>

//                         {/* Exemplo de Formatos de Exibição (Se existirem no teu mock) */}
//                         {formats && formats.length > 0 && (
//                           <>
//                             <span className="w-1 h-1 rounded-full bg-border" />
//                             <div className="flex gap-1 font-mono text-xs">
//                               {formats.map((fmt: string) => (
//                                 <span
//                                   key={fmt}
//                                   className="border border-border/80 px-1.5 py-0.5 rounded text-foreground/80"
//                                 >
//                                   {fmt}
//                                 </span>
//                               ))}
//                             </div>
//                           </>
//                         )}
//                       </div>

//                       {/* Sinopse */}
//                       <p className="max-w-xl text-base text-muted-foreground leading-relaxed line-clamp-3 my-2">
//                         {movie.synopsis}
//                       </p>

//                       {/* Botões de Ação */}
//                       <div className="flex flex-wrap gap-4 pt-4">
//                         <Link
//                           href={`/movies/${movie.id}#cinemas`}
//                           className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm md:text-base font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 transform hover:-translate-y-0.5"
//                         >
//                           <Ticket className="h-5 w-5" /> Comprar Bilhete
//                         </Link>
//                         <Link
//                           href={`/movies/${movie.id}#trailer`}
//                           className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-sm md:text-base font-bold text-foreground transition hover:border-foreground/50 hover:bg-card"
//                         >
//                           <Play className="h-5 w-5 fill-foreground" /> Ver
//                           Trailer
//                         </Link>
//                       </div>
//                     </div>

//                     {/* Poster do Filme (Lugar de destaque da cor) */}
//                     <div className="hidden md:block relative aspect-2/3 w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 group-hover:border-primary/50 transition-colors duration-500 transform rotate-1 group-hover:rotate-0">
//                       <Image
//                         src={movie.posterUrl}
//                         alt={`Poster de ${movie.title}`}
//                         fill
//                         className="object-cover"
//                         sizes="280px"
//                       />
//                       <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
//                       <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white">
//                         <span className="text-xs font-medium bg-black/60 px-2 py-1 rounded backdrop-blur-sm tracking-wide">
//                           {movie.language}
//                         </span>
//                         <span className="text-xs font-medium border border-white/40 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
//                           LEG: {movie.subtitleLanguage}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="absolute bottom-0 left-0 right-0 h-3 dot-divider opacity-30 z-20" />
//                 </div>
//               </CarouselItem>
//             );
//           })}
//         </CarouselContent>
//       </Carousel>
//     </section>
//   );
// }
