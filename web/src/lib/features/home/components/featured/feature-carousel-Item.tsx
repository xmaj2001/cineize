"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Play, Ticket, Bell, Check, Sparkles } from "lucide-react";
import { CarouselItem } from "@/components/ui/carousel";
import { FeaturedMovieItem } from "../../type";
import { getAgeRatingConfig } from "./age-rating";

interface FeaturedCarouselItemProps {
  movie: FeaturedMovieItem;
  lang: string;
  dict: any;
  onTrailerClick: (movie: FeaturedMovieItem) => void;
  onNotifyClick?: (movie: FeaturedMovieItem) => void;
}

export function FeaturedCarouselItem({
  movie,
  lang,
  dict,
  onTrailerClick,
  onNotifyClick,
}: FeaturedCarouselItemProps) {
  const [isNotified, setIsNotified] = useState(false);
  const ageRatingConfig = getAgeRatingConfig(movie.ageRating);

  const handleNotifyToggle = () => {
    setIsNotified((prev) => !prev);
    if (onNotifyClick) {
      onNotifyClick(movie);
    }
  };

  // Mapeamento de texto da tag baseado puramente no STATUS do filme
  const getStatusLabel = () => {
    switch (movie.status) {
      case "PRESALE":
        return dict.movies.hero.presale || "Pré-Venda";
      case "COMING_SOON":
        return dict.movies.hero.coming_soon || "Em Breve";
      case "NOW_SHOWING":
      default:
        return dict.movies.hero.now_showing || "Em Cartaz";
    }
  };

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
          />
        )}

        {/* Overlays Monocromáticos de Transição */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Conteúdo */}
        <div className="absolute inset-0 grid max-w-7xl mx-auto px-4 md:px-8 z-10 items-center py-12 md:grid-cols-[1fr_280px] gap-8">
          <div className="flex flex-col justify-center gap-4 text-foreground">
            {/* Linha Decorativa + Estado do Filme (Usa exclusivamente movie.status) */}
            <div className="mb-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="h-px flex-1 max-w-16 bg-border/60" aria-hidden />
              <span
                className={`font-mono font-bold ${
                  movie.status === "PRESALE"
                    ? "text-amber-400"
                    : movie.status === "COMING_SOON"
                      ? "text-amber-400"
                      : "text-primary"
                }`}
              >
                {getStatusLabel()}
              </span>
              <span className="h-px flex-1 max-w-16 bg-border/60" aria-hidden />
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight tracking-tighter text-white drop-shadow-sm">
              {movie.title}
            </h1>

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm md:text-base text-muted-foreground font-sans">
              {movie.genres && movie.genres.length > 0 && (
                <>
                  <span className="font-bold text-white/90">
                    {movie.genres.join(", ")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                </>
              )}

              {movie.durationMinutes && (
                <>
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Clock className="h-4 w-4" /> {movie.durationMinutes} min
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                </>
              )}

              {/* Classificação Etária */}
              <span
                className={`rounded px-2 py-0.5 text-xs font-mono font-bold border backdrop-blur-xs ${ageRatingConfig.badgeClass}`}
              >
                {ageRatingConfig.label}
              </span>
            </div>

            {/* Sinopse */}
            {movie.synopsis && (
              <p className="max-w-xl text-base text-muted-foreground leading-relaxed line-clamp-3 my-2">
                {movie.synopsis}
              </p>
            )}

            {/* Botões de Ação Dinâmicos por Status */}
            <div className="flex flex-wrap gap-4 pt-4">
              {movie.status === "COMING_SOON" && (
                /* Botão "Notificar-me" para Em Breve */
                <button
                  onClick={handleNotifyToggle}
                  className={`inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm md:text-base font-bold shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer ${
                    isNotified
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                      : "bg-amber-500 text-black hover:bg-amber-400"
                  }`}
                >
                  {isNotified ? (
                    <>
                      <Check className="h-5 w-5" />
                      {dict.movies.hero.notified || "Notificação Ativa"}
                    </>
                  ) : (
                    <>
                      <Bell className="h-5 w-5 fill-current" />
                      {dict.movies.hero.notify_me || "Notificar-me"}
                    </>
                  )}
                </button>
              )}

              {movie.status === "PRESALE" && (
                /* Botão "Garantir Bilhete" para Pré-venda */
                <Link
                  href={`/${lang}/movies/${movie.slug}`}
                  className="inline-flex items-center gap-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white px-8 py-3.5 text-sm md:text-base font-bold shadow-lg transition transform hover:-translate-y-0.5"
                >
                  {dict.movies.hero.buy_presale || "Garantir Pré-venda"}
                </Link>
              )}

              {movie.status === "NOW_SHOWING" && (
                /* Botão "Ver Sessões" para Filmes Em Cartaz */
                <Link
                  href={`/${lang}/movies/${movie.slug}`}
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm md:text-base font-bold text-primary-foreground shadow-lg transition hover:bg-primary/90 transform hover:-translate-y-0.5"
                >
                  <Ticket className="h-5 w-5" />
                  {dict.movies.hero.view_sessions || "Ver Sessões"}
                </Link>
              )}

              {/* Botão de Trailer */}
              {movie.trailerUrl && (
                <button
                  onClick={() => onTrailerClick(movie)}
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-sm md:text-base font-bold text-foreground transition hover:border-foreground/50 hover:bg-card cursor-pointer"
                >
                  <Play className="h-5 w-5 fill-foreground" />{" "}
                  {dict.movies.hero.watch_trailer}
                </button>
              )}
            </div>
          </div>

          {/* Poster do Filme Otimizado por Status */}
          <div
            className={`hidden md:block relative aspect-2/3 w-full rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-500 transform rotate-1 group-hover:rotate-0 ${
              movie.status === "PRESALE"
                ? "border-amber-500/50 group-hover:border-amber-500 group-hover:shadow-amber-500/20"
                : movie.status === "COMING_SOON"
                ? "border-amber-500/50 group-hover:border-amber-500 group-hover:shadow-amber-500/20"
                : "border-border/50 group-hover:border-primary/50 group-hover:shadow-primary/20"
            }`}
          >
            {/* Imagem do Poster */}
            <Image
              src={movie.posterUrl || "/placeholder.png"}
              alt={`Poster de ${movie.title}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="280px"
            />

            {/* Overlays no Poster */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Badge Flutuante no Topo do Poster */}
            <div className="absolute top-3 right-3 z-10">
              <span
                className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded-md border backdrop-blur-md shadow-md ${
                  movie.status === "PRESALE"
                    ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                    : movie.status === "COMING_SOON"
                    ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                    : "bg-black/60 text-white border-white/20"
                }`}
              >
                {getStatusLabel()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
}