import { getFeaturedMovies } from "../../queries";
import { FeaturesCarousel } from "./features-carousels";

interface FeaturesContentProps {
  lang: string;
  dict: any;
}

export async function FeaturesContent({ lang, dict }: FeaturesContentProps) {
  const response = await getFeaturedMovies();

  const movies = response?.data || [];

  if (movies.length === 0) {
    return null;
  }

  return <FeaturesCarousel features={movies} lang={lang} dict={dict} />;
}