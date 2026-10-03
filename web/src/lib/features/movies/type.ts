// type.ts
export type Format = "TWOD" | "THREED" | "FOURD" | "MAX";

export interface FeaturedMovieItem {
  id: number;
  title: string;
  slug: string;
  posterUrl: string | null;
  trailerUrl: string | null;
  headline: string | null;
  bannerUrl: string | null;
}

export type MovieDetails = {
  id: number;
  title: string;
  slug: string;
  synopsis: string;
  durationMinutes: number;
  genres: string[];
  ageRating: string;
  director: string;
  cast: string[];
  worldLaunchDate: Date | null;
  basePrice: number;
  posterUrl: string;
  status?: "NOW_SHOWING" | "COMING_SOON" | "PRESALE";
  backdropUrl: string;
  trailerUrl: string;
};

export interface FeedMovieItem {
  id: number;
  title: string;
  slug: string;
  posterUrl: string;
  genres: string[];
  formats: string[];
  isPreEstreia: boolean;
  sessions: {
    id: number;
    startDateTime: string;
  }[];
}
