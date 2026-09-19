import { movieService } from "@/lib/features/movies";
import NotFound from "../../not-found";
import { HeaderMovie } from "@/components/movies/HeaderMovie";
import { SessionsList } from "@/components/movies/SessionsList";
import { JsonLd } from "@/components/JsonLd";
import { getDictionary, Locale } from "@/app/lib/dictionaries";

interface MoviePageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}
export default async function MoviePage({ params }: MoviePageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const movie = await movieService.getMovieById(slug);

  if (!movie.success) return NotFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.data.title,
    image: movie.data.posterUrl,
    description: movie.data.synopsis,
    director: {
      "@type": "Person",
      name: movie.data.director || "Unknown",
    },
    dateCreated: movie.data.releaseDate,
    duration: `PT${movie.data.durationMin}M`,
    genre: movie.data.genres || [],
    ...(movie.data.trailerUrl
      ? {
          trailer: {
            "@type": "VideoObject",
            name: `Trailer - ${movie.data.title}`,
            description: `Trailer oficial de ${movie.data.title}`,
            thumbnailUrl: movie.data.posterUrl,
            contentUrl: movie.data.trailerUrl,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <HeaderMovie movie={movie.data} lang={lang} />
      <div className="px-4 py-8 md:px-8 max-w-7xl mx-auto flex flex-col gap-10">
        <SessionsList sessions={movie.data.sessionMovies} lang={lang} />
      </div>
    </>
  );
}
