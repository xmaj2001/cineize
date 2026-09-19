export type SeatKind = "STANDARD" | "RECLINER" | "ACCESSIBLE";
export type TicketStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type ScreenFormat = "D2" | "D3" | "D4X" | "IMAX" | "VIP";
export type SessionType = "NORMAL" | "PREMIERE";
export type PricingTier = "WEEKDAY" | "WEEKEND" | "HOLIDAY" | "STUDENT";

export interface SessionSeat {
  id: string;
  row: string;
  number: number;
  type: SeatKind;
  status: TicketStatus;
}

export interface SessionLocation {
  id: string;
  name: string;
  province: string;
  city: string;
}

export interface SessionRoom {
  id: string;
  name: string;
  capacity: number;
  format: ScreenFormat;
  location: SessionLocation;
}

export interface SessionMovieCard {
  id: string;
  title: string;
  posterUrl: string;
  durationMin: number;
  ageRating: string;
}

export interface ApiSessionDetail {
  id: string;
  type: SessionType;
  tier: PricingTier;
  startTime: string;
  endTime: string;
  saleOpensAt: string;
  price: number;
  movie: SessionMovieCard;
  room: SessionRoom;
  seats: SessionSeat[];
}

/**
 * Evento emitido pelo endpoint SSE do backend quando o estado
 * de um assento muda (reserva, compra, expiração do TTL).
 */
export interface SeatUpdateEvent {
  sessionId: string;
  seatId: string;
  status: TicketStatus;
}
