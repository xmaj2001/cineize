"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  Play,
  Star,
  Calendar,
  Sparkles,
  Flame,
  Tag,
  Bell,
} from "lucide-react";
import Image from "next/image";
import { getMoviesFormat } from "@/components/movies/utiles";
import { ApiMovieDetails, SessionType } from "@/lib/features/movies";
import { NotifyMeModal } from "./NotifyMeModal";
import { TrailerModal } from "./TrailerModal";

import { getDictionary } from "@/app/lib/dictionaries";

interface HeaderMovieProps {
  movie: ApiMovieDetails;
  lang: string;
}

export function HeaderMovie({ movie, lang }: HeaderMovieProps) {
  const dict = getDictionary(lang);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const formats = useMemo(
    () => getMoviesFormat(movie.sessionMovies ?? []),
    [movie.sessionMovies],
  );

  // ── Lógica Inteligente do Estado do Filme ──────────────────────────────────
  const movieState = useMemo(() => {
    const now = new Date();
    const sessions = movie.sessionMovies ?? [];

    const hasStartedSessions = sessions.some(
      (s) => new Date(s.startTime) <= now,
    );
    const hasPresaleSessions = sessions.some(
      (s) => new Date(s.saleOpensAt) <= now && new Date(s.startTime) > now,
    );
    const hasPreEstreia = sessions.some(
      (s) => s.type === SessionType.PREMIERE,
    );

    if (hasPreEstreia) {
      return {
        label: dict.movies.header.pre_premiere_special,
        badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        icon: Sparkles,
      };
    }

    if (hasPresaleSessions) {
      return {
        label: dict.movies.header.presale_open,
        badgeClass: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        icon: Flame,
      };
    }

    if (hasStartedSessions) {
      return {
        label: dict.movies.header.now_showing,
        badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        icon: Tag,
      };
    }

    return {
      label: dict.movies.header.coming_soon_cinemas,
      badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: Calendar,
    };
  }, [movie, dict]);

  const StateIcon = movieState.icon;

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Backdrop de Fundo */}
      {movie.bannerUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={movie.bannerUrl}
            alt={`Backdrop de ${movie.title}`}
            fill
            priority
            className="object-cover blur-md md:blur-sm scale-110 transition-transform duration-1000"
            sizes="100vw"
          />
        </div>
      )}

      {/* Máscara de Gradiente para Leitura Perfeita */}
      <div className="absolute inset-0 z-0 bg-linear-to-r from-background via-background/40 to-background/10" />
      <div className="absolute inset-0 z-0 bg-linear-to-t from-background via-transparent to-background/50" />

      {/* Conteúdo Principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-10 md:pt-32 md:pb-16 grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-8 items-end">
        {/* Lado Esquerdo: Detalhes do Filme */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Badge Inteligente de Estado */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border backdrop-blur-md ${movieState.badgeClass}`}
            >
              <StateIcon className="h-3.5 w-3.5" />
              <span>{movieState.label}</span>
            </div>

            {/* Classificação Etária em destaque visual */}
            <span className="rounded-md bg-card/80 px-2 py-1 text-xs font-mono font-bold text-foreground border border-border/60 backdrop-blur-sm">
              {movie.ageRating}
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[1.05] tracking-tight text-foreground drop-shadow-sm">
            {movie.title}
          </h1>

          {/* Linha de Metadados Otimizada */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            {/* Géneros */}
            {movie.genres?.length > 0 && (
              <span className="font-medium text-foreground">
                {movie.genres.join(" · ")}
              </span>
            )}

            {movie.genres?.length > 0 && (
              <span className="w-1 h-1 rounded-full bg-border" />
            )}

            {/* Duração */}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/80" />
              {movie.durationMin} min
            </span>

            <span className="w-1 h-1 rounded-full bg-border" />

            {/* Idioma / Legendagem */}
            <span className="font-mono text-xs uppercase">
              {movie.language}
              {movie.subtitleLanguage && (
                <span className="text-muted-foreground/70">
                  {" "}
                  ({dict.movies.header.subtitles}: {movie.subtitleLanguage.toUpperCase() || "N/A"})
                </span>
              )}
            </span>

            {/* Formatos Disponíveis (2D, 3D, IMAX...) */}
            {formats.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1">
                  {formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="border border-primary/40 bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-primary"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Lançamento & Direção */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
            {movie.releaseDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-foreground/60" />
                {dict.movies.header.premiere_date}:{" "}
                {new Date(movie.releaseDate).toLocaleDateString(lang === "en" ? "en-US" : "pt-PT", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}

            {movie.director && (
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-foreground/60" />
                {dict.movies.header.director}: {movie.director}
              </span>
            )}
          </div>

          {/* Sinopse resumida com limite responsivo */}
          {movie.synopsis && (
            <p className="max-w-2xl text-sm sm:text-base text-muted-foreground/90 leading-relaxed line-clamp-3 sm:line-clamp-4 font-normal">
              {movie.synopsis}
            </p>
          )}

          {/* Ações / Apenas Trailer (Sem botão de compra) */}
          <div className="flex items-center gap-4 pt-2">
            {movieState.label === dict.movies.header.coming_soon_cinemas && (
              <button
                onClick={() => setIsNotifyModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95"
              >
                <Bell className="h-4 w-4" /> {dict.movies.header.notify_me}
              </button>
            )}

            {movie.trailerUrl && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all duration-200 hover:border-foreground/40 hover:bg-card hover:scale-[1.02] active:scale-95"
              >
                <Play className="h-4 w-4 fill-foreground" /> {dict.movies.header.watch_trailer}
              </button>
            )}
          </div>
        </div>

        {/* Lado Direito: Poster de Capa (Visível a partir de ecrãs Médios) */}
        <div className="hidden md:block relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/40 group">
          <Image
            src={movie.posterUrl}
            alt={`Poster de ${movie.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 260px, 300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        </div>
      </div>

      {/* Divisor Visual Suave */}
      <div className="absolute bottom-0 left-0 right-0 h-3 dot-divider opacity-20 z-20" />

      {/* Modal Avisar-me */}
      {isNotifyModalOpen && (
        <NotifyMeModal
          movieId={movie.id}
          movieTitle={movie.title}
          onClose={() => setIsNotifyModalOpen(false)}
        />
      )}

      {/* Modal Trailer */}
      {isTrailerOpen && movie.trailerUrl && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          movieTitle={movie.title}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </section>
  );
}
