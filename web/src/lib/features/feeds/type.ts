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