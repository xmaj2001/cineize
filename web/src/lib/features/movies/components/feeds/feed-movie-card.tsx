"use client";

import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { FeedMovieItem } from "../../type";
import { FORMAT_MAP } from "@/components/movies/utiles";

interface FeedMovieCardProps {
  movie: FeedMovieItem;
}

export function FeedMovieCard({ movie }: FeedMovieCardProps) {
  const { isPreEstreia, formats, sessions } = movie;

  // Lógica para transformar as sessões brutas da API em botões rápidos
  // Mostramos no máximo 4 sessões (ex: "Hoje 19:00", "Seg 14:00")
  const dateLocale = ptBR;
  const sessionEntries = sessions.slice(0, 4).map((session) => {
    const date = parseISO(session.startDateTime);
    // Formato abreviado do dia da semana e hora
    const label = format(date, "EEE HH:mm", { locale: dateLocale });

    return {
      id: session.id,
      label,
    };
  });

  return (
    <div className="group relative flex flex-col">
      {/* Link Principal: Clicar no poster leva para a página geral do filme */}
      <Link href={`/movies/${movie.slug || movie.id}`} className="block">
        <div
          className={`relative overflow-hidden rounded-md bg-card ${
            isPreEstreia
              ? "movie-card-pre-estreia border-2"
              : "border border-border"
          }`}
        >
          <div className="aspect-2/3 w-full relative">
            <Image
              src={movie.posterUrl || "/placeholder.png"}
              alt={`Poster do filme ${movie.title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          </div>

          {/* Badges de Formato no Topo */}
          {formats && formats.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-1 z-10 flex-wrap max-w-[80%]">
              {formats.map((fmt, i) => (
                <span
                  key={i}
                  className="rounded-sm bg-black/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white/90 backdrop-blur-xs border border-white/10"
                >
                  {FORMAT_MAP[fmt].label}
                </span>
              ))}
            </div>
          )}

          {/* Badge Pré-Estreia */}
          {isPreEstreia && (
            <div className="absolute top-2 right-2 z-10">
              <span className="rounded-sm bg-amber-500/90 px-2 py-0.5 text-[9px] font-mono font-bold text-black uppercase tracking-wider backdrop-blur-xs shadow-sm">
                {"PRÉ-ESTREIA"}
              </span>
            </div>
          )}

          {/* Overlay com informação sobre o Poster */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-3 pt-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 truncate">
              {movie.genres?.join(", ")}
            </div>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-white group-hover:text-primary transition-colors leading-tight">
              {movie.title}
            </h3>
          </div>
        </div>
      </Link>

      {/* Horários Rápidos com dia da semana */}
      {sessionEntries.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {sessionEntries.map((entry) => (
            <Link
              key={entry.id}
              href={`/sessions/${entry.id}`}
              className={`rounded-sm border px-2 py-0.5 text-[10px] font-mono font-semibold transition-all duration-200 capitalize ${
                isPreEstreia
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black hover:border-amber-500"
                  : "border-border/80 bg-secondary/60 text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
              }`}
              title={"Clique para selecionar"}
            >
              {entry.label}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-2.5 px-1">
          <span className="text-[10px] text-muted-foreground uppercase font-mono">
            Sem sessões agendadas
          </span>
        </div>
      )}
    </div>
  );
}
