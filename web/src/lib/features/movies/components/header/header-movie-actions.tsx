"use client";

import { Dictionary } from "@/app/lib/dictionaries";
import { MovieDetails } from "../../type";
import { Bell, Play } from "lucide-react";
import { useState } from "react";
import { NotifyMeModal } from "./NotifyMeModal";
import { TrailerModal } from "./TrailerModal";

interface HeaderMovieActionsProps {
  dict: Dictionary;
  movie: MovieDetails;
  isComingSoon: boolean;
}

export function HeaderMovieActions({
  dict,
  movie,
  isComingSoon,
}: HeaderMovieActionsProps) {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  if (!isComingSoon && !movie.trailerUrl) return null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 pt-3">
        {/* Botão Primário: Notificar */}
        {isComingSoon && (
          <button
            onClick={() => setIsNotifyModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Bell className="h-4 w-4 shrink-0" />
            <span>{dict.movies.header.notify_me}</span>
          </button>
        )}

        {/* Botão Secundário: Ver Trailer (Efeito Glassmorphism) */}
        {movie.trailerUrl && (
          <button
            onClick={() => setIsTrailerOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-background/40 backdrop-blur-md px-6 py-3 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-foreground transition-all duration-200 hover:bg-card/80 hover:border-foreground/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-foreground shrink-0" />
            <span>{dict.movies.header.watch_trailer}</span>
          </button>
        )}
      </div>

      {/* Modais */}
      {isNotifyModalOpen && (
        <NotifyMeModal
          movieId={movie.id.toString()}
          movieTitle={movie.title}
          onClose={() => setIsNotifyModalOpen(false)}
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