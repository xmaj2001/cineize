"use client";

import { useState } from "react";
import { Film, User, ChevronDown, ChevronUp } from "lucide-react";
import { ApiMovieDetails } from "@/lib/features/movies";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

interface MovieInfoProps {
  movie: ApiMovieDetails;
  lang?: string;
}

export function MovieInfo({ movie, lang: propLang }: MovieInfoProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || "pt";
  const dict = getDictionary(lang);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Synopsis ── */}
      <section>
        <h2 className="text-lg font-display font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <span className="dotted-x w-8 text-foreground/30" aria-hidden />
          {dict.movies.info.synopsis}
        </h2>
        <div className="relative">
          <p
            className={`text-sm md:text-base text-muted-foreground leading-relaxed transition-all duration-300 ${
              synopsisExpanded ? "" : "line-clamp-4"
            }`}
          >
            {movie.synopsis}
          </p>
          {movie.synopsis && movie.synopsis.length > 300 && (
            <button
              onClick={() => setSynopsisExpanded(!synopsisExpanded)}
              className="mt-2 text-xs font-mono font-semibold text-primary hover:underline flex items-center gap-1 transition-colors"
            >
              {synopsisExpanded ? (
                <>
                  {dict.movies.info.show_less} <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  {dict.movies.info.read_more} <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>
      </section>

      {/* ── Cast & Director ── */}
      <section>
        <h2 className="text-lg font-display font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
          <span className="dotted-x w-8 text-foreground/30" aria-hidden />
          {dict.movies.info.cast_crew}
        </h2>

        <div className="flex flex-col gap-4">
          {/* Director */}
          {movie.director && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
                <Film className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {dict.movies.info.director}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {movie.director}
                </p>
              </div>
            </div>
          )}

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {movie.cast.map((actor) => (
                <span
                  key={actor}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-foreground/40"
                >
                  <User className="h-3 w-3 text-muted-foreground" />
                  {actor}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Trailer ── */}
      {movie.trailerUrl && (
        <section id="trailer">
          <h2 className="text-lg font-display font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
            <span className="dotted-x w-8 text-foreground/30" aria-hidden />
            {dict.movies.info.trailer}
          </h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-card">
            <iframe
              src={convertToEmbedUrl(movie.trailerUrl)}
              title={`Trailer de ${movie.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </section>
      )}
    </div>
  );
}

/** Converts YouTube watch URLs to embed format */
function convertToEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // youtube.com/watch?v=ID
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    // youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}
