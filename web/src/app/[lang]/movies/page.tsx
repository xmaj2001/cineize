import { getDictionary, Locale } from "@/app/lib/dictionaries";
import { InfiniteMoviesFeed } from "@/lib/features/feeds/components/infinite-movies-feed";
import { Film } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: MoviesPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.movies.page.title,
    description: dict.movies.page.description,
    openGraph: {
      title: dict.movies.page.title,
      description: dict.movies.page.description,
    },
  };
}

interface MoviesPageProps {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MoviesPage({
  params,
  searchParams,
}: MoviesPageProps) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const dict = getDictionary(lang);

  // const search =
  //   typeof resolvedSearchParams?.search === "string"
  //     ? resolvedSearchParams.search
  //     : undefined;
  // const urlStatus =
  //   typeof resolvedSearchParams?.status === "string"
  //     ? resolvedSearchParams.status
  //     : "todos";
  // const format =
  //   typeof resolvedSearchParams?.format === "string"
  //     ? resolvedSearchParams.format
  //     : "todos";
  // const locationId =
  //   typeof resolvedSearchParams?.locationId === "string"
  //     ? resolvedSearchParams.locationId
  //     : undefined;

  // let apiStatus: string | undefined = undefined;
  // if (urlStatus === "em-cartaz") apiStatus = "nowShowing";
  // else if (urlStatus === "pre-venda") apiStatus = "presale";
  // else if (urlStatus === "brevemente") apiStatus = "comingSoon";

  // let initialPage = undefined;
  // try {
  //   initialPage = await movieService.getMovies({
  //     search: search || undefined,
  //     status: apiStatus,
  //     format: format !== "todos" ? format : undefined,
  //     locationId: locationId,
  //     limit: 10,
  //   });
  // } catch (e) {
  //   console.error("Falha ao carregar initialPage no servidor", e);
  // }

  // const jsonLd = {
  //   "@context": "https://schema.org",
  //   "@type": "ItemList",
  //   name: "Filmes em exibição - cineIze",
  //   itemListElement:
  //     initialPage?.data?.items?.map((movie, index) => ({
  //       "@type": "ListItem",
  //       position: index + 1,
  //       item: {
  //         "@type": "Movie",
  //         url: `https://www.cineize.co.ao/${lang}/movies/${movie.id}`,
  //         name: movie.title,
  //         image: movie.posterUrl,
  //       },
  //     })) || [],
  // };

  return (
    <main className="px-4 py-8 md:px-8 max-w-7xl mx-auto mt-24 flex flex-col gap-10">
        {/* 1. Header da Página */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Film className="h-5 w-5 text-primary" />
              <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                {dict.movies.page.tag}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground mt-1">
              {dict.movies.page.heading}
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg">
              {dict.movies.page.subtitle}
            </p>
          </div>
        </div>
        {/* <MovieList lang={lang} initialPage={initialPage} /> */}
        <InfiniteMoviesFeed lang={lang} dict={dict} />
      </main>
  );
}
