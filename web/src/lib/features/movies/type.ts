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
    backdropUrl: string;
    trailerUrl: string;
}


export type HallFormat = "TWOD" | "THREED" | "FOURD" | "IMAX" | string;

interface Cinema {
  name: string;
  slug: string;
}

export type MovieSession = {
  id: number;
  startTime: Date;
  endTime: Date;
  price: number;
  format: HallFormat;
  cinema: Cinema;
}

