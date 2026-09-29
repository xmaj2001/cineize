// type.ts
export type Format = "TWOD" | "THREED" | "FOURD" | "MAX";

export interface CatalogSession {
  id: number;
  startDateTime: string; // Date vira string no JSON
  price: string;         // Prisma Decimal serializa como string
  cinema: { slug: string };
}

// now-showing e presale (mesmo formato)
export interface CatalogMovieItem {
  id: number;
  title: string;
  slug: string;
  posterUrl: string | null;
  genres: string[];
  durationMinutes: number;
  formats: Format[];
  sessions: CatalogSession[];
}

export interface ComingSoonMovieItem {
  id: number;
  title: string;
  slug: string;
  posterUrl: string | null;
  genres: string[];
  durationMinutes: number;
  worldLaunchDate: string;
}

export interface FeaturedMovieItem {
  id: number;
  title: string;
  slug: string;
  posterUrl: string | null;
  trailerUrl: string | null;
  headline: string | null;
  bannerUrl: string | null;
}

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
