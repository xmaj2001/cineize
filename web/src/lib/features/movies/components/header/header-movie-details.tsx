import { Calendar, Clock, Film, Star } from "lucide-react";
import { Dictionary } from "@/app/lib/dictionaries";
import { MovieDetails } from "../../type";

interface HeaderMovieDetailsProps {
  movie: MovieDetails;
  dict: Dictionary;
  lang: string;
}

export function HeaderMovieDetails({
  movie,
  dict,
  lang,
}: HeaderMovieDetailsProps) {
  const formattedDate = movie.worldLaunchDate
    ? new Date(movie.worldLaunchDate).toLocaleDateString(
        lang === "en" ? "en-US" : "pt-PT",
        { day: "numeric", month: "short", year: "numeric" }
      )
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. BADGES SUPERIORES: Géneros & Classificação */}
      {movie.genres && movie.genres.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="inline-flex items-center rounded-md bg-secondary/80 border border-border/50 px-2.5 py-0.5 text-xs font-mono font-medium text-secondary-foreground backdrop-blur-sm"
            >
              {genre}
            </span>
          ))}
          {movie.ageRating && (
            <span className="inline-flex items-center rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-mono font-bold text-primary">
              {movie.ageRating}
            </span>
          )}
        </div>
      )}

      {/* 2. TÍTULO PRINCIPAL (Maior peso visual da página) */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-foreground drop-shadow-md leading-[1.05]">
        {movie.title}
      </h1>

      {/* 3. METADADOS SECUNDÁRIOS: Duração, Lançamento & Direção */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground font-mono">
        {movie.durationMinutes > 0 && (
          <span className="flex items-center gap-1.5 text-foreground/90 font-medium">
            <Clock className="h-4 w-4 text-primary" />
            {movie.durationMinutes} min
          </span>
        )}

        {formattedDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-muted-foreground">{dict.movies.header.premiere_date}:</span>
            <span className="text-foreground/90 font-medium">{formattedDate}</span>
          </span>
        )}

        {movie.director && (
          <span className="flex items-center gap-1.5">
            <Film className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-muted-foreground">{dict.movies.header.director}:</span>
            <span className="text-foreground/90 font-medium">{movie.director}</span>
          </span>
        )}
      </div>

      {/* 4. SINOPSE (Leitura confortável) */}
      {movie.synopsis && (
        <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-4 font-normal pt-1">
          {movie.synopsis}
        </p>
      )}
    </div>
  );
}