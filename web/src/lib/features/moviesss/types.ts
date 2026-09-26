export interface ApiMovie {
  id: string;
  title: string;
  posterUrl: string;
  bannerUrl: string | null;
  durationMin: number;
  ageRating: string;
  genres: string[];
  status: "ACTIVE" | "ARCHIVED";
  language: string;
  synopsis: string;
  subtitleLanguage: string | null;
  trailerUrl?: string | null;
  sessionMovies?: {
    id: string;
    type: string;
    startTime: string;
    room: {
      id: string;
      format: string;
      locationId: string;
    };
  }[];
}

export interface HomeFeed {
  featured: ApiMovie[];
  nowShowing: ApiMovie[];
  presale: ApiMovie[];
  comingSoon: ApiMovie[];
}

export interface Room {
  id: string;
  name: string;
  format: "D2" | "D3" | "D4X" | "IMAX" | "VIP";
  location: {
    id: string;
    name: string;
    province: string;
    city: string;
    latitude: number;
    longitude: number;
  };
}

export enum SessionType {
  NORMAL = "NORMAL",
  PREMIERE = "PREMIERE",
}

export interface ApiSessionMovie {
  id: string;
  movieId: string;
  roomId: string;
  type: SessionType;
  tier: string;
  startTime: string;
  endTime: string;
  saleOpensAt: string;
  price: any;
  room: Room;
}

export interface ApiMovieDetails extends Omit<ApiMovie, "sessionMovies"> {
  synopsis: string;
  cast: string[];
  trailerUrl: string | null;
  director: string;
  featured: boolean;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  sessionMovies: ApiSessionMovie[];
}

// ── Mock Seat Types (mirrors Prisma schema) ──

export type SeatKind = "STANDARD" | "RECLINER" | "ACCESSIBLE";
export type TicketStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export interface MockSeat {
  id: string;
  row: string;
  number: number;
  type: SeatKind;
  status: TicketStatus;
}

