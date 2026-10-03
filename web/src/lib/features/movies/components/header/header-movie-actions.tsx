"use client";

import { useState } from "react";
import { Dictionary } from "@/app/lib/dictionaries";
import { MovieDetails } from "../../type";
import { Bell, Play, Ticket, Sparkles } from "lucide-react";
import { NotifyMeModal } from "@/lib/features/movies/components/header/NotifyMeModal";
import { TrailerModal } from "@/lib/features/movies/components/header/TrailerModal";

interface HeaderMovieActionsProps {
  dict: Dictionary;
  movie: MovieDetails;
  lang: string;
}

export function HeaderMovieActions({
  dict,
  movie,
  lang,
}: HeaderMovieActionsProps) {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const isComingSoon = movie.status === "COMING_SOON";
  const isPresale = movie.status === "PRESALE";
  const isNowShowing = movie.status === "NOW_SHOWING";

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-3">
        {/* 1. Botão 'Notificar-me' (Apenas para EM BREVE) */}
        {isComingSoon && (
          <button
            onClick={() => setIsNotifyModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Bell className="h-4 w-4 shrink-0 fill-current" />
            <span>{dict.movies.header.notify_me || "Notificar-me"}</span>
          </button>
        )}

        {/* 2. Botão 'Garantir Pré-venda' (Apenas para PRÉ-VENDA) */}
        {isPresale && (
          <a
            href="#sessions"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider shadow-lg shadow-amber-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>
              {dict.movies.header.buy_presale }
            </span>
          </a>
        )}

        {/* 3. Botão 'Ver Sessões' (Apenas para EM CARTAZ) */}
        {/* {isNowShowing && (
          <a
            href="#sessions"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Ticket className="h-4 w-4 shrink-0" />
            <span>{dict.movies.header.view_sessions || "Ver Sessões"}</span>
          </a>
        )} */}

        {/* Botão Secundário: Assistir Trailer */}
        {movie.trailerUrl && (
          <button
            onClick={() => setIsTrailerOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-background/40 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-foreground transition-all duration-200 hover:bg-card/80 hover:border-foreground/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-foreground shrink-0" />
            <span>{dict.movies.header.watch_trailer || "Ver Trailer"}</span>
          </button>
        )}
      </div>

      {/* Modais */}
      {isNotifyModalOpen && (
        <NotifyMeModal
          movieId={movie.id.toString()}
          movieTitle={movie.title}
          onClose={() => setIsNotifyModalOpen(false)}
          lang={lang}
        />
      )}

      {isTrailerOpen && movie.trailerUrl && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          movieTitle={movie.title}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </>
  );
}
