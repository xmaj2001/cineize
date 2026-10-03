import Image from "next/image";
import { Dictionary } from "@/app/lib/dictionaries";
import { HeaderMovieDetails } from "./header-movie-details";
import { HeaderMoviePoster } from "./header-movie-poster";
import { getMovieBySlug } from "../../queries";
import { HeaderMovieActions } from "./header-movie-actions";
import { notFound } from "next/navigation";

interface HeaderMovieContentProps {
  slug: string;
  dict: Dictionary;
  lang: string;
}

export async function HeaderMovieContent({
  slug,
  dict,
  lang,
}: HeaderMovieContentProps) {
  const res = await getMovieBySlug(slug);

  if (!res.success) {
    notFound();
  }

  const movie = res.data;

  return (
    <header className="relative w-full overflow-hidden bg-background">
      {/* Backdrop de Fundo */}
      {movie.backdropUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={movie.backdropUrl}
            alt={`Backdrop de ${movie.title}`}
            fill
            priority
            className="object-cover blur-md sm:blur-sm scale-105 opacity-40 transition-transform duration-1000"
            sizes="100vw"
          />
        </div>
      )}

      {/* Máscaras de Gradiente Direcionadas para Leitura Perfeita */}
      <div className="absolute inset-0 z-0 bg-linear-to-r from-background via-background/20 to-transparent" />
      <div className="absolute inset-0 z-0 bg-linear-to-t from-background via-background/10 to-transparent" />

      {/* Container Principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-12 md:pt-32 md:pb-16 grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-8 items-end">
        {/* Lado Esquerdo: Detalhes + Ações */}
        <div className="flex flex-col gap-6 w-full">
          <HeaderMovieDetails movie={movie} dict={dict} lang={lang} />
          <HeaderMovieActions dict={dict} movie={movie} lang={lang} />
        </div>

        {/* Lado Direito: Poster de Capa */}
        {movie.posterUrl && (
          <HeaderMoviePoster posterUrl={movie.posterUrl} title={movie.title} />
        )}
      </div>

      {/* Divisor Visual no Rodapé do Header */}
      <div className="absolute bottom-0 left-0 right-0 h-3 dot-divider opacity-20 z-20" />
    </header>
  );
}
