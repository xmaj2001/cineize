export type SeatKind = "STANDARD" | "RECLINER" | "ACCESSIBLE";
export type SeatStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type SessionSeat = {
  id: string;
  row: string;
  number: number;
  type: SeatKind;
  status: SeatStatus;
}

export interface MovieSessionDetail {
  id: string;
  startTime: Date;
  endTime: Date;
  room: number;
  movie: {
    title: string;
    slug: string;
    posterUrl: string;
    backdropUrl: string;
    durationMinutes: number;
  };
  cinema: {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
  };
  seats: SessionSeat[];
  price: number;
  format: string;
  type: string;
}

interface Cinema {
  name: string;
  slug: string;
}

export type HallFormat = "TWOD" | "THREED" | "FOURD" | "IMAX" | string;

export type MovieSession = {
  id: number;
  startTime: Date;
  endTime: Date;
  price: number;
  format: HallFormat;
  cinema: Cinema;
};

