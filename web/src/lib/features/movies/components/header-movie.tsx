import { Suspense } from "react";
import { Dictionary } from "@/app/lib/dictionaries";
import { HeaderMovieSkeleton } from "./header/header-movie-skeleton";
import { HeaderMovieContent } from "./header/header-movie-content";

interface HeaderMovieProps {
  slug: string;
  dict: Dictionary;
  lang: string;
}

export function HeaderMovie({ slug, dict, lang }: HeaderMovieProps) {
  return (
    <Suspense fallback={<HeaderMovieSkeleton />}>
      <HeaderMovieContent slug={slug} dict={dict} lang={lang} />
    </Suspense>
  );
}